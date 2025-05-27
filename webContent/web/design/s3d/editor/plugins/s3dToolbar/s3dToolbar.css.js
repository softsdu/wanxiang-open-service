import styleInject from '../../node_modules/style-inject/dist/style-inject.es.js';

var css_248z = ".s3dToolbarContainer{\r\n\tposition: absolute;\r\n    left:50%; \r\n    bottom:10px;\r\n\twidth:auto;\r\n\theight:50px;     \r\n    font-size:13px;\r\n    color:#fcfcfc;\r\n}\r\n.s3dToolbarBackground{\r\n\tposition: absolute;\t\r\n\twidth: 100%;\r\n\theight: 100%;  \r\n\tbackground-color: #444444;\r\n\tborder-radius: 5px;\r\n\topacity: 0.85;\r\n\tfilter: alpha(opacity=85); \r\n}\r\n.s3dToolbarInnerContainer{\r\n\tposition:relative;\r\n    padding:5px;\r\n}   \r\n.s3dToolbarBtnContainer{\r\n\tposition:relative; \r\n    overflow: hidden;  \r\n    width:40px;\r\n\theight:40px;\r\n\tfloat:left;\r\n\tborder-radius: 3px;\r\n\tmargin-left:3px;\r\n\tmargin-right:3px;\r\n\tcursor:pointer;\r\n} \r\n.s3dToolbarBtnContainer:hover{\r\n\tbackground-color: #444444;\r\n} \r\n.s3dToolbarBtnImg{\r\n\tposition:absolute;  \r\n\ttop:4px;  \r\n\tleft:4px;\r\n    width:32px;\r\n\theight:32px;\r\n\ttext-align:center;\r\n}";
styleInject(css_248z);

export { css_248z as default };
