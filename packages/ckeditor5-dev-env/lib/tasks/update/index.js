/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const { tools, workspace, git, logger } = require( '@ckeditor/ckeditor5-dev-utils' );

/**
 * 1. Fetch all branches from each origin in main CKEditor 5 repository.
 * 2. Get CKEditor 5 dependencies from package.json in main CKEditor 5 repository.
 * 3. If dependency's repository is already cloned in workspace:
 *		3.1. Fetch all branches from each origin.
 *		3.2. Checkout to specified branch.
 *		3.3. Pull changes to that branch.
 *		3.4. if --npm-update was specified run npm update --dev in that repository.
 *		3.5. Recreate symbolic link between repo and main node_modules.
 * 4. If dependency's repository is not cloned yet - run gulp install on this dependency.
 * 5. Remove symbolic links to dependencies that are not used in current package.json configuration.
 * 6. if --npm-update was specified run npm update --dev in main CKEditor 5 repository.
 *
 * @param {Function} installTask Install task to use on each dependency that is missing from workspace.
 * @param {String} ckeditor5Path Path to main CKEditor5 repository.
 * @param {Object} packageJSON Parsed package.json file from CKEditor5 repository.
 * @param {String} workspaceRoot Relative path to workspace root.
 * @param {Boolean} runNpmUpdate When set to true `npm update` will be executed inside each plugin repository
 * and inside CKEditor 5 repository.
 */
module.exports = ( installTask, ckeditor5Path, packageJSON, workspaceRoot, runNpmUpdate ) => {
	const log = logger();
	const workspaceAbsolutePath = path.join( ckeditor5Path, workspaceRoot );

	// Fetch main repository
	log.info( `Fetching branches from ${ packageJSON.name }...` );
	git.fetchAll( ckeditor5Path );

	// Get all CKEditor dependencies from package.json.
	const dependencies = workspace.getDependencies( packageJSON.dependencies );

	if ( dependencies ) {
		const directories = workspace.getDirectories( workspaceAbsolutePath );

		for ( let dependency in dependencies ) {
			const repositoryURL = dependencies[ dependency ];
			const urlInfo = git.parseRepositoryUrl( repositoryURL );
			const repositoryAbsolutePath = path.join( workspaceAbsolutePath, dependency );

			// Check if repository's directory already exists.
			if ( directories.indexOf( urlInfo.name ) > -1 ) {
				log.info( `Fetching branches from ${ urlInfo.name }...` );
				git.fetchAll( repositoryAbsolutePath );

				log.info( `Checking out ${ urlInfo.name } to ${ urlInfo.branch }...` );
				git.checkout( repositoryAbsolutePath, urlInfo.branch );

				log.info( `Pulling changes to ${ urlInfo.name }...` );
				git.pull( repositoryAbsolutePath, urlInfo.branch );

				if ( runNpmUpdate ) {
					log.info( `Running "npm update" in ${ urlInfo.name }...` );
					tools.npmUpdate( repositoryAbsolutePath );
				}

				try {
					log.info( `Linking ${ repositoryURL }...` );
					tools.linkDirectories( repositoryAbsolutePath, path.join( ckeditor5Path, 'node_modules', dependency ) );
				} catch ( error ) {
					log.error( error );
				}
			} else {
				// Directory does not exits in workspace - install it.
				installTask( ckeditor5Path, workspaceRoot, repositoryURL );
			}
		}

		if ( runNpmUpdate ) {
			log.info( `Running "npm update" in CKEditor5 repository...` );
			tools.npmUpdate( ckeditor5Path );
		}
	} else {
		log.info( 'No CKEditor5 dependencies found in package.json file.' );
	}

	// Remove symlinks not used in this configuration.
	const nodeModulesPath = path.join( ckeditor5Path, 'node_modules' );
	const symlinks = workspace.getSymlinks( nodeModulesPath );
	symlinks
		.filter( dir => typeof dependencies[ dir ] == 'undefined' )
		.forEach( dir => {
			log.info( `Removing symbolic link to ${ dir }.` );
			tools.removeSymlink( path.join( nodeModulesPath, dir ) );
		} );
};
