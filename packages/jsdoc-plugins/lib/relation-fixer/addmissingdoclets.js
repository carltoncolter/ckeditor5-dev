/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

'use strict';

const getMissingDocletsData = require( './getmissingdocletsdata' );
const cloneDeep = require( 'lodash' ).cloneDeep;
const DocletCollection = require( '../utils/doclet-collection' );

module.exports = addMissingDoclets;

/**
 * Adds missing doclets of members coming from implemented interfaces and extended classes.
 * JSDoc does not support inheritance of static members which is why the plugin was made.
 * This module requires the input to be processed by 'buildrelations' module first.
 *
 * @param {Array.<Doclet>} originalDoclets
 * @returns {Array.<Doclet>}
 */
function addMissingDoclets( originalDoclets ) {
	const clonedDoclets = cloneDeep( originalDoclets );
	const docletCollection = new DocletCollection();
	const typedefDoclets = [];

	for ( const doclet of clonedDoclets ) {
		// Group doclets by memberof property.
		docletCollection.add( `memberof:${ doclet.memberof }`, doclet );

		if ( doclet.kind === 'typedef' ) {
			typedefDoclets.push( doclet );
		}
	}

	const entitiesWhichNeedNewDoclets = clonedDoclets.filter( d => {
		return d.kind === 'class' || d.kind === 'interface' || d.kind === 'mixin';
	} );
	const newDocletsToAdd = [];
	const docletsToIgnore = [];
	const settings = [
		// Missing statics inherited from parent classes.
		{
			relation: 'augmentsNested',
			filter: {
				scope: 'static'
			}
		},

		// Missing events inherited from parent classes.
		{
			relation: 'augmentsNested',
			filter: {
				kind: 'event'
			}
		},

		// Everything mixed, except existing mixed items.
		{
			relation: 'mixesNested',
			onlyImplicitlyInherited: true
		},

		// Everything from implemented interfaces.
		{
			relation: 'implementsNested'
		}
	];

	for ( const childDoclet of entitiesWhichNeedNewDoclets ) {
		for ( const setting of settings ) {
			const missingDocletsData = getMissingDocletsData(
				docletCollection,
				childDoclet,
				setting
			);

			newDocletsToAdd.push( ...missingDocletsData.newDoclets );
			docletsToIgnore.push( ...missingDocletsData.docletsWhichShouldBeIgnored );
		}
	}

	docletsToIgnore.forEach( d => {
		d.ignore = true;
	} );
	clonedDoclets.push( ...newDocletsToAdd );

	extendTypedefs( typedefDoclets );

	return clonedDoclets;
}

// Copy properties from parent typedefs to typedefs which extend them.
function extendTypedefs( typedefDoclets ) {
	for ( const typedefDoclet of typedefDoclets ) {
		for ( const parentLongname of typedefDoclet.augmentsNested ) {
			const parentDoclet = typedefDoclets.find( d => d.longname === parentLongname ) || {};

			if ( parentDoclet.properties ) {
				parentDoclet.properties.forEach( parentProperty => {
					if ( typedefDoclet.properties && !typedefDoclet.properties.find( p => p.name === parentProperty.name ) ) {
						const inheritedProperty = cloneDeep( parentProperty );
						inheritedProperty.inherited = true;
						typedefDoclet.properties.push( inheritedProperty );
					}
				} );
			}
		}
	}
}
