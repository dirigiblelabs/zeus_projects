/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/projects";
const HTML_LINK = "../projects/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Projects",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Projects",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Define",
      "order": 103
   };
};
