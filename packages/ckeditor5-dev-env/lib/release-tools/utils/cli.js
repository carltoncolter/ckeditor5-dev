/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const inquirer = require( 'inquirer' );
const semver = require( 'semver' );

const cli = {
	/**
	 * Asks a user for a confirmation for creating the releases.
	 *
	 * @param {Map} packages Packages to release.
	 * @returns {Promise}
	 */
	confirmRelease( packages ) {
		let message = 'Packages to release:\n';

		for ( const packageName of Array.from( packages.keys() ).sort() ) {
			const packageDetails = packages.get( packageName );

			message += `  * "${ packageName }": v${ packageDetails.previousVersion } => v${ packageDetails.version }\n`;
		}

		message += 'Continue?';

		const confirmQuestion = {
			message,
			type: 'confirm',
			name: 'confirm',
			default: true,
		};

		return inquirer.prompt( [ confirmQuestion ] )
			.then( answers => answers.confirm );
	},

	/**
	 * Asks a user for providing the new version.
	 *
	 * @param {String} packageVersion
	 * @param {String|null} releaseType
	 * @param {Object} [options]
	 * @param {Boolean} [options.disableInternalVersion=false] Whether to "internal" version is enabled.
	 * @returns {Promise}
	 */
	provideVersion( packageVersion, releaseType, options = {} ) {
		const suggestedVersion = getSuggestedVersion();

		let message = 'Type the new version, "skip" or "internal"';

		if ( options.disableInternalVersion ) {
			message = 'Type the new version or "skip"';
		}

		message += ` (suggested: "${ suggestedVersion }", current: "${ packageVersion }"):`;

		const versionQuestion = {
			type: 'input',
			name: 'version',
			default: suggestedVersion,
			message,

			filter( input ) {
				return input.trim();
			},

			validate( input ) {
				if ( input === 'skip' || ( !options.disableInternalVersion && input === 'internal' ) ) {
					return true;
				}

				// TODO: Check whether provided version is available.
				return semver.valid( input ) ? true : 'Please provide a valid version.';
			}
		};

		return inquirer.prompt( [ versionQuestion ] )
			.then( answers => answers.version );

		function getSuggestedVersion() {
			if ( !releaseType ) {
				return 'skip';
			}

			if ( releaseType === 'internal' ) {
				return options.disableInternalVersion ? 'skip' : 'internal';
			}

			if ( semver.prerelease( packageVersion ) ) {
				releaseType = 'prerelease';
			}

			// If package's version is below the '1.0.0', bump the 'minor' instead of 'major'
			if ( releaseType === 'major' && semver.gt( '1.0.0', packageVersion ) ) {
				return semver.inc( packageVersion, 'minor' );
			}

			return semver.inc( packageVersion, releaseType );
		}
	},

	/**
	 * Asks a user for providing the GitHub token.
	 *
	 * @returns {Promise}
	 */
	provideToken() {
		const tokenQuestion = {
			type: 'password',
			name: 'token',
			message: 'Provide the GitHub token:',
			validate( input ) {
				return input.length === 40 ? true : 'Please provide a valid token.';
			}
		};

		return inquirer.prompt( [ tokenQuestion ] )
			.then( answers => answers.token );
	},

	/**
	 * Asks a user for selecting services where packages will be released.
	 *
	 * If the user choices a GitHub, required token also has to be provided.
	 *
	 * @returns {Promise}
	 */
	configureReleaseOptions() {
		const options = {};

		const servicesQuestion = {
			type: 'checkbox',
			name: 'services',
			message: 'Select services where packages will be released:',
			choices: [
				'npm',
				'GitHub'
			],
			default: [
				'npm',
				'GitHub'
			]
		};

		return inquirer.prompt( [ servicesQuestion ] )
			.then( answers => {
				options.skipNpm = answers.services.indexOf( 'npm' ) === -1;
				options.skipGithub = answers.services.indexOf( 'GitHub' ) === -1;

				if ( options.skipGithub ) {
					return options;
				}

				return cli.provideToken()
					.then( token => {
						options.token = token;

						return options;
					} );
			} );
	}
};

module.exports = cli;
