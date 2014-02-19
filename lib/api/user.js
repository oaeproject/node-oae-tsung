/*
 * Copyright 2012 Sakai Foundation (SF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var ApiUtil = require('./util');

/**
 * Load the user activity dashboard
 *
 * @param  {Session}    session         A Tsung session.
 * @param  {String}     userId         The id of the user whose activities to load
 * @param  {Object}     [opts]          Optional parameters
 * @param  {Boolean}    [opts.pageLoad] Whether or not this transaction is also a page load. Default: `false`
 */
var activity = module.exports.activity = function(session, userId, opts) {
    ApiUtil.activity('user', session, userId, opts);
};

/**
 * Scroll activities downward on the bottom of the user activity page.
 *
 * @param  {Session}    session     A Tsung session
 * @param  {String}     userId      The id of the user whose activities we're scrolling
 */
var activityScroll = module.exports.activityScroll = function(session, userId) {
    ApiUtil.activityScroll('user', session, userId);
};

/**
 * Load the content library page of a user
 *
 * @param  {Session}    session         A session
 * @param  {String}     userId          The id of the user whose content library to load
 * @param  {Object}     [opts]          Optional parameters
 * @param  {Boolean}    [opts.pageLoad] Whether or not the transaction was a fresh page load
 */
var contentLibrary = module.exports.contentLibrary = function(session, userId, opts) {
    ApiUtil.library('user', 'content', session, userId, opts);
};

/**
 * Scroll content library items downward on the bottom of the user content library page.
 *
 * @param  {Session}    session     A Tsung user session
 * @param  {String}     userId     The id of the user whose content library to scroll
 */
var contentLibraryScroll = module.exports.contentLibraryScroll = function(session, userId) {
    ApiUtil.libraryScroll('user', 'content', session, userId);
};

/**
 * Search the content library of the user
 *
 * @param  {Session}    session     The Tsung user session
 * @param  {String}     userId      The id of the user whose library to search
 * @param  {String}     [q]         The search query. Default: *
 * @return {Object}                 An object with field `scroll` which is a function that, when invoked with no params, will simply create a new transaction against the session that gets the next page of results
 */
var contentLibrarySearch = module.exports.contentLibrarySearch = function(session, userId, q) {
    ApiUtil.librarySearch('user', 'content', session, userId, q);
};

/**
 * Load the discussion library page of a user
 *
 * @param  {Session}    session         A session
 * @param  {String}     userId          The id of the user whose discussion library to load
 * @param  {Object}     [opts]          Optional parameters
 * @param  {Boolean}    [opts.pageLoad] Whether or not the transaction was a fresh page load
 */
var discussionLibrary = module.exports.discussionLibrary = function(session, userId, opts) {
    ApiUtil.library('user', 'discussion', session, userId, opts);
};

/**
 * Scroll discussion library items downward on the bottom of the user discussion library page.
 *
 * @param  {Session}    session     A Tsung user session
 * @param  {String}     userId     The id of the user whose discussion library to scroll
 */
var discussionLibraryScroll = module.exports.discussionLibraryScroll = function(session, userId) {
    ApiUtil.libraryScroll('user', 'discussion', session, userId);
};

/**
 * Search the discussion library of the user
 *
 * @param  {Session}    session     The Tsung user session
 * @param  {String}     userId      The id of the user whose library to search
 * @param  {String}     [q]         The search query. Default: *
 * @return {Object}                 An object with field `scroll` which is a function that, when invoked with no params, will simply create a new transaction against the session that gets the next page of results
 */
var discussionLibrarySearch = module.exports.discussionLibrarySearch = function(session, userId, q) {
    ApiUtil.librarySearch('user', 'discussion', session, userId, q);
};

/**
 * Loads the memberships page for a user
 *
 * @param  {Session}    session         A Tsung session
 * @param  {String}     userId          The id of the user whose memberships to fetch
 * @param  {Object}     [opts]          Optional parameters
 * @param  {Boolean}    [opts.pageLoad] Whether or not the transaction was a fresh page load
 */
var memberships = module.exports.memberships = function(session, userId, opts) {
    opts = opts || {};
    var txId = 'user_memberships';
    if (opts.pageLoad) {
        txId += '_load';
    }

    var tx = session.addTransaction(txId);

    // First add the requests associated to loading the user page
    if (opts.pageLoad) {
        ApiUtil.addResourcePageLoadRequests('user', tx, userId);
    }

    // Then add the memberships requests
    _membershipsRequest(tx, userId, null);
};

/**
 * Scrolls the memberships page for a user
 *
 * @param  {Session}    session     A Tsung session
 * @param  {String}     userId      The id of the user whose memberships to scroll
 */
var membershipsScroll = module.exports.membershipsScroll = function(session, userId) {
    var tx = session.addTransaction('user_memberships_scroll');
    _membershipsRequest(tx, userId);
};

/**
 * Searches the memberships page for a user
 *
 * @param  {Session}    session     A Tsung user session
 * @param  {String}     userId      The id of the user whose memberships to search
 * @param  {String}     [q]         The search query. Default: *
 * @return {Object}                 An object with field `scroll` which is a function that, when invoked with no params, will simply create a new transaction against the session that gets the next page of results
 */
var membershipsSearch = module.exports.membershipsSearch = function(session, userId, q) {
    var tx = session.addTransaction('search_memberships');

    var searchOpts = {'limit': 12};
    if (q) {
        searchOpts.q = q;
    }

    return ApiUtil.addSearchRequests(session, tx, 'memberships', [userId], searchOpts);
};

/**
 * Follow the given user
 *
 * @param  {Session}    session         A Tsung user session
 * @param  {String}     userId          The id of the user to follow
 */
var follow = module.exports.follow = function(session, userId) {
    var tx = session.addTransaction('user_follow');
    tx.addRequest('POST', '/api/following/' + userId + '/follow');
};

/**
 * Views the network following tab of a user
 *
 * @param  {Session}    session         A Tsung user session
 * @param  {String}     userId          The id of the user whose network to view
 * @param  {Object}     [opts]          Optional parameters
 * @param  {Boolean}    [opts.pageLoad] Whether or not the transaction was a fresh page load
 */
var networkFollowing = module.exports.networkFollowing = function(session, userId, opts) {
    opts = opts || {};
    var txId = 'user_network_following';
    if (opts.pageLoad) {
        txId += '_load';
    }

    var tx = session.addTransaction(txId);

    if (opts.pageLoad) {
        ApiUtil.addResourcePageLoadRequests('user', tx, userId);
    }

    _followingRequest(tx, userId, null);
};

/**
 * Scrolls the network following tab of a user
 *
 * @param  {Session}    session         A Tsung user session
 * @param  {String}     userId          The id of the user whose network to view
 */
var networkFollowingScroll = module.exports.networkFollowingScroll = function(session, userId) {
    var tx = session.addTransaction('user_network_following_scroll');
    _followingRequest(tx, userId);
};

/**
 * Searches the network following tab of a user
 *
 * @param  {Session}    session     A Tsung user session
 * @param  {String}     userId      The id of the user whose following to search
 * @param  {String}     [q]         The search query. Default: *
 * @return {Object}                 An object with field `scroll` which is a function that, when invoked with no params, will simply create a new transaction against the session that gets the next page of results
 */
var networkFollowingSearch = module.exports.networkFollowingSearch = function(session, userId, q) {
    var tx = session.addTransaction('user_network_following_search');

    var searchOpts = {'limit': 12};
    if (q) {
        searchOpts.q = q;
    }

    return ApiUtil.addSearchRequests(session, tx, 'following', [userId], searchOpts);
};

/**
 * Views the network followers tab of a user
 *
 * @param  {Session}    session         A Tsung user session
 * @param  {String}     userId          The id of the user whose network to view
 * @param  {Object}     [opts]          Optional parameters
 * @param  {Boolean}    [opts.pageLoad] Whether or not the transaction was a fresh page load
 */
var networkFollowers = module.exports.networkFollowers = function(session, userId, opts) {
    opts = opts || {};
    var txId = 'user_network_followers';
    if (opts.pageLoad) {
        txId += '_load';
    }

    var tx = session.addTransaction(txId);

    if (opts.pageLoad) {
        ApiUtil.addResourcePageLoadRequests('user', tx, userId);
    }

    _followersRequest(tx, userId, null);
};

/**
 * Scrolls the network followers tab of a user
 *
 * @param  {Session}    session         A Tsung user session
 * @param  {String}     userId          The id of the user whose network to view
 */
var networkFollowersScroll = module.exports.networkFollowersScroll = function(session, userId) {
    var tx = session.addTransaction('user_network_followers_scroll');
    _followingRequest(tx, userId);
};

/**
 * Searches the network followers tab of a user
 *
 * @param  {Session}    session     A Tsung user session
 * @param  {String}     userId      The id of the user whose followers to search
 * @param  {String}     [q]         The search query. Default: *
 * @return {Object}                 An object with field `scroll` which is a function that, when invoked with no params, will simply create a new transaction against the session that gets the next page of results
 */
var networkFollowersSearch = module.exports.networkFollowersSearch = function(session, userId, q) {
    var tx = session.addTransaction('user_network_followers_search');

    var searchOpts = {'limit': 12};
    if (q) {
        searchOpts.q = q;
    }

    return ApiUtil.addSearchRequests(session, tx, 'followers', [userId], searchOpts);
};

/**
 * Create a memberships request on the transaction
 *
 * @param  {Transaction}    tx          The transaction on which to create the request
 * @param  {String}         userId      The id of the user whose memberships to fetch
 * @param  {String}         [start]     The starting point of the page of memberships. If `null`, will start from beginning. If `undefined` will start from last known scroll point
 */
var _membershipsRequest = function(tx, userId, start) {
    var nextPageTokenVar = 'user_memberships_scroll_next_start';
    var opts = {'limit': 12};
    if (start) {
        opts.start = start;
    } else if (start === undefined) {
        opts.start = '%%_' + nextPageTokenVar + '%%';
    }

    var membershipsRequest = tx.addRequest('GET', '/api/user/' + userId + '/memberships', opts);
    membershipsRequest.addDynamicVariable(nextPageTokenVar, 'json', '$.results[11].id');
};

/**
 * Create a request to the user's following feed on the transaction
 *
 * @param  {Transaction}    tx          The transaction on which to create the request
 * @param  {String}         userId      The id of the user whose following feed to fetch
 * @param  {String}         [start]     The starting point of the page of followed users. If `null`, will start from beginning. If `undefined` will start from last known scroll point
 */
var _followingRequest = function(tx, userId, start) {
    var nextPageTokenVar = 'user_following_scroll_next_start';
    var opts = {'limit': 12};
    if (start) {
        opts.start = start;
    } else if (start === undefined) {
        opts.start = '%%_' + nextPageTokenVar + '%%';
    }

    var followingRequest = tx.addRequest('GET', '/api/following/' + userId + '/following', opts);
    followingRequest.addDynamicVariable(nextPageTokenVar, 'json', '$.nextToken');
};

/**
 * Create a request to the user's followers feed on the transaction
 *
 * @param  {Transaction}    tx          The transaction on which to create the request
 * @param  {String}         userId      The id of the user whose followers feed to fetch
 * @param  {String}         [start]     The starting point of the page of following users. If `null`, will start from beginning. If `undefined` will start from last known scroll point
 */
var _followersRequest = function(tx, userId, start) {
    var nextPageTokenVar = 'user_followers_scroll_next_start';
    var opts = {'limit': 12};
    if (start) {
        opts.start = start;
    } else if (start === undefined) {
        opts.start = '%%_' + nextPageTokenVar + '%%';
    }

    var followersRequest = tx.addRequest('GET', '/api/following/' + userId + '/followers', opts);
    followersRequest.addDynamicVariable(nextPageTokenVar, 'json', '$.nextToken');
};
