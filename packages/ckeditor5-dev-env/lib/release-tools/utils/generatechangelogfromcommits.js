/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'fs' );
const conventionalChangelog = require( 'conventional-changelog' );
const changelogUtils = require( './changelog' );
const getWriterOptions = require( './transform-commit/getwriteroptions' );
const parserOptions = require( './transform-commit/parser-options' );
const { stream, logger } = require( '@ckeditor/ckeditor5-dev-utils' );
const { additionalCommitNotes } = require( './transform-commit/transform-commit-utils' );

/**
 * Generates a changelog based on user's commits in the repository and saves
 * it in the changelog file.
 *
 * @param {Object} options
 * @param {String} options.version A version for generated changelog.
 * @param {Function} options.transformCommit A function which transforms the commit.
 * @param {String|null} options.tagName Name of the last created tag for the repository.
 * @param {String} options.newTagName Name of the tag for current version.
 * @param {Boolean} [options.isInternalRelease=false] Whether the changelog is generated for internal release.
 * @param {Boolean} [options.doNotSave=false] If set on `true`, changes will be resolved in returned promise
 * instead of saving in CHANGELOG file.
 * @param {Boolean} [options.additionalNotes=false] If set on `true, each category will contain additional description.
 * @returns {Promise}
 */
module.exports = function generateChangelogFromCommits( options ) {
	const log = logger();

	return new Promise( resolve => {
		if ( !options.doNotSave && !fs.existsSync( changelogUtils.changelogFile ) ) {
			log.warning( 'Changelog file does not exist. Creating...' );

			changelogUtils.saveChangelog( changelogUtils.changelogHeader );
		}

		const context = {
			version: options.version,
			currentTag: options.newTagName,
			previousTag: options.tagName,
			displayLogs: false,
			isInternalRelease: options.isInternalRelease || false,
			additionalNotes: {},
		};

		if ( options.additionalNotes ) {
			context.additionalNotes = additionalCommitNotes;
		}

		const gitRawCommitsOpts = {
			from: options.tagName,
			merges: undefined,
			firstParent: true
		};

		const writerOptions = getWriterOptions( options.transformCommit );

		conventionalChangelog( {}, context, gitRawCommitsOpts, parserOptions, writerOptions )
			.pipe( saveChangelogPipe( options.version, resolve, options.doNotSave ) );
	} );
};

function saveChangelogPipe( version, done, doNotSave = false ) {
	return stream.noop( changes => {
		if ( doNotSave ) {
			return done( changes.toString() );
		}

		let currentChangelog = changelogUtils.getChangelog();

		// Remove header from current changelog.
		currentChangelog = currentChangelog.replace( changelogUtils.changelogHeader, '' );

		// Concat header, new and current changelog.
		let newChangelog = changelogUtils.changelogHeader + changes.toString() + currentChangelog.trim();
		newChangelog = newChangelog.trim() + '\n';

		// Save the changelog.
		changelogUtils.saveChangelog( newChangelog );

		done( version );
	} );
}
