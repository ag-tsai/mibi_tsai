/* #########################################
   #########################################
   ##########                     ##########
   ##########   MIBI_TSAI CLASS   ##########
   ##########                     ##########
   #########################################
   #########################################
   
   Major sections (*** denotes important):
    Variables and user functions for changing settings
     url                  : standalone, tsai, run_log, mibi_tracker, mibi_control, mibi_configuration, mibi_hv, mibi_service, mibi_settings
     json                 : slide_id, section_ids, name, original, empty, tiles, list {sequential, random}, split, changed, resume, rearrange
     mibi                 : version, fovs, focus_sites, focus_onlys, rasters, dwells, presets, recommended, sed_crop {left, right}
     coregistration       : cookie, last, automatic_time, automatic_coordinates, manual_time, manual_coordinates, json, default, shift*** {x_x, x_y, y_x, y_y}
     action               : type***, item***, mouse_down, mouse_up, mouse_dragged, nudge_opt, nudge, nudge_shift
     tiles***             : [] -> {active, fov, map, original}
     image***, images*** {optical, sed, import} -> name, key***, img, type, crop, coordinates***, scale***, transform***, brightness, contrast, loaded
     canvas               : draw***, draw_context***, prerender***, prerender_context***, div, optical_crop, optical_bounds {left, right, top, bottom}, cursor_size, cursor_opacity, cursor_color, slide_labels, slide_labels_font, slide_labels_size, line_thickness, line_circle, line_color, line_colors, hover_line_opacity, hover_fill_opacity
     tma                  : crosshair, line_opacity, labels, rows, columns, row_start, column_start, order, orders {tl0, tl1, tr0, tr1, br0, br1, bl0, bl}, points, corners, corner_adjust, corner_start, revert
     scratch              : tiles, polygon***, polygons, polygons_revert, corners, shift***
     coordinates          : optical, import, sed, crosshair, line_color_default, line_thickness, line_opacity, line_colors
    Body onload           : onload***
    General               : cookie_set, cookie_get, copy_array, time_pad, time_format, element_position***, element_toggle, element_toggle_on, element_toggle_off, menus_close
    Matrix                : matrix_diagonal, matrix_identity, matrix_inverse, matrix_transpose, matrix_dot_matrix, matrix_dot_vector, matrix_perspective_coefficients***, matrix_perspective***, matrix_perspective_transform***, matrix_perspective_reverse***
    General action        : action_position***, action_event***, action_clear, action_prerender***
    Files                 : files_drop, files_append, files_drag_over, files_drag_leave, files_load***, files_sort***
    Label                 : labels_insert, labels_load, labels_build, labels_select, labels_close
    Image                 : image_load***, image_tab***, image_tab_reset, image_save
    JSON parse            : json_equal, json_equal_strict, json_parse_id, json_parse_preset, json_warnings, json_warnings_clear, json_read***, json_append, json_load***
    JSON build            : json_summary***, json_radio, json_fovs***, json_empty, json_resume, json_lists***, json_sort, json_random, json_random_groups, json_buttons, json_dragover, json_dragdrop, json_dragstart, json_dragbefore, json_split, json_split_fovs, json_split_time, json_time, json_export
    Draw shapes           : draw_clear***, draw_line***, draw_rect, draw_cursor, draw_cursor_size, draw_cursor_color, draw_cursor_size_crement, draw_cursor_opacity, draw_cursor_opacity_crement, draw_line_thickness, draw_line_thickness_crement
    Draw image            : draw_zoom, draw_zoom_crement, draw_filter, draw_filter_crement, draw_key, draw_reset***
    Tile draw general     : tile_fov_corners***, tile_draw_autofocus***, tile_draw_fov***, tiles_draw***, tile_draw***, draw_slide_labels, draw_slide_labels_size, draw_slide_labels_size_crement, draw_slide_focus_circles, tile_hover***, tile_hover_click
    Tile builder          : tiles_selects, tiles_builder, tiles_builder_slide_id, tiles_build
    Tile div              : tiles_write***, tile_div***, tile_menu, tile_expand, tile_name, tile_position_set, tile_fov, tile_raster, tile_preset, tile_dwell, tile_depth, tile_focus_site, tile_focus_only, tile_slide_id, tile_section_id, tile_reset, tile_delete, tile_pixels
    Tile map              : tile_map_crement, tile_map_unshift, tile_map_resize***, tile_map_check
    Coregistration        : coregistration_load***, coregistration_set***, coregistration_cookie_set, coregistration_link, coregistration_from_micron***, coregistration_to_micron***
    Optical coregistration: optical_to_base64, optical_from_base64, optical_automatic_code***, optical_coordinates_fill, optical_manual_code***, optical_coordinates_draw, optical_coordinates***, optical_action***, optical_set
    SED                   : sed_crop, sed_code***, sed_shift_set, sed_coordinates_draw, sed_coordinates***, sed_action***
    Tile draw move        : move_load, move_nudge, move_action***
    Tile draw click/erase : corners_coordinates_load***, corners_coordinates***, corners_find, click_load, click_action***, erase_load, erase_action***
    Tile draw duplicate   : duplicate_load, duplicate_action***, duplicate_tile***
    Tile draw polygon     : polygon_example, polygon_builder, polygon_close, polygon_file_revert, polygon_file_load, polygon_file_import, polygon_action***, polygon_in, polygon_intersect_line, polygon_intersects, polygon_tile***
    TMA                   : draw_tma_crosshair, draw_tma_crosshair_crement, tma_builder, tma_resize, tma_crement, tma_name_rc, tma_close, tma_revert, tma_order, tma_action***, tma_draw***, tma_prepend, tma_build***
    Import                : import_sort, import_read, import_errors, import_errors_clear, import_coordinates_draw, import_coordinates***, import_action***, import_identity, import_prepend, import_coordinates_select, import_build***
    FOV navigation        : navigation_code_clear, navigation_code_arrows, navigation_code_move, navigation_code_sed_save, navigation_code_logger,  navigation_code***, navigation_adjust_file, navigation_adjust***, navigation_errors, navigation_errors_clear
   
   Animation notes:
    The background image is controlled by several <img> because it is faster than loading in and out of canvas.
    Cropping is controlled by div overflow:hidden div margin-left=-crop. From actual testing it seems that two canvas
    overlays (one static layer and one animation layer) as well as a prerender is slower than one canvas overly as well
    as the prerender. That is, it is faster to perform clearRect, drawImage from prerender, and line draws than to have
    a static canvas layer, then perform clearRect and line draws onto the animation layer. This may be because we have
    to do clearRect frequently on both the static and animation layers and then the browser has to merge all three
    layers. Note that drawImage is faster than putImageData so we take a little extra trouble to use drawImage.
        
    Thus, we prerender using:
     tsai.draw_clear(tsai.canvas.draw_context);
     tsai.tiles_draw(tsai.canvas.prerender, [except]);
    To animate:
     tsai.canvas.draw.drawImage(tsai.canvas.prerender);
     tsai.draw_line(tsai.canvas.draw_context, from, to, color, thickness); ...
    For coordinates crosshairs, speed is less of a concern:
     tsai.draw_clear(tsai.canvas.draw_context);
     tsai.draw_line(tsai.canvas.draw_context, from, to, color, thickness); ...
   
   Coregistration notes:
    There are multiple ways to load coregistration coordinates: automatic cookie, manual cookie,
    automatic search string, manual full coordinates search string, manual micron coordinates search
    string, JSON, and SED image. Also, the image can be loaded before the coregistration or vice
    versa. 
*/

class MIBI_TSAI {

  /* ###################################
     ###################################
     ##########               ##########
     ##########   VARIABLES   ##########
     ##########               ##########
     ###################################
     ################################### */
  
  
  url={
   standalone:            false,     // true writes URLs to standalone navigation bar
   tsai:                  '',        // url to TSAI
   run_log:               '',        // url to run log
   mibi_tracker:          '',        // url to MIBItracker
   mibi_control:          'http://ionpath/#/',          // url to MIBIcontrol
   mibi_configuration:    'http://ionpath/config-ui/',  // url to MIBI configuration UI
   mibi_hv:               'http://ionpath/hv-ui/',      // url to MIBI HV control
   mibi_service:          'http://ionpath/service-ui/', // url to MIBI service UI
   mibi_settings:         'http://ionpath/settings-ui/' // url to MIBI settings UI
  }
  json={
   slide_id:              0,
   section_ids:           [], 
   name:                  '',        // file name (pulled from image)
   original:              {},        // parsed json file
   empty:                 '',        // stringified json file without FOVs
   tiles:                 [],        // tiles for last json_lists
   list:
   {sequential:           [],        // sequential array of {fov:reference to fov, tile:tile_index, group:group_index, focus_x:x, focus_y:y, time:seconds}
    random:               []         // randomized array of {fov:reference to fov, tile:tile_index, group:group_index, focus_x:x, focus_y:y, time:seconds}
   },
   split:                 [],        // array of {button, suffix with fovs, [fovs]}
   changed:               false,     // if tiles changed from json.original
   resume:                0          // last index for json resume
  }
  mibi={
   fovs:                  [],        // list of allowable fov sizes
   version:               '1.6',     // fovFormatVersion
   version_latest:        '1.6',     // current fovFormatVersion
   version_prior:         '1.5',     // version prior to focusOnly and focusSite
   focus_sites:           ['None', 'FOV', 'NW', 'N', 'NE', 'W', 'E', 'SW', 'S', 'SE'], // list of allowable focus sites
   focus_onlys:           [0, 1],    // list of allowable focus only values
   dwells:                [],        // list of allowable dwell times and their corresponding indexes
   rasters:               [],        // list of allowable imaging raster sizes
   presets:               {},        // dictionary of [version][jsons of default fovs]
   recommended:           {},        // recommended settings for fovs
   sed_crop:              {left: 0, right:0} // percentage to crop from left and right of SED image
  }
  coregistration={
   cookie:                '',     // name of coregistration cookie
   last:                  '',     // type of last used coregistration coordinates (automatic or manual)
   automatic_time:        '',     // time automatic coregistration performed
   automatic_coordinates: '',     // automatic coregistration coordinates as string
   manual_time:           '',     // time manual coregistration performed
   manual_coordinates:    '',     // manual coregistration coordinates as string
   json:                  '',     // json coregistration coordinates as string
   default:               '',     // default coregistration coordinates as string
   shift:                 {x_x: 0, x_y: 0, y_x: 0, y_y: 0} // correction coefficients for mibi shift
  }
  action={
   type:                  '',        // selected action
   item:                  -1,        // identifier (e.g. index) of item (e.g. tile) selected for action
   mouse_down:            {},        // canvas coordinate on mousedown {x: x, y: y}
   mouse_up:              {},        // canvas coordinate on mouseup   {x: x, y: y}
   mouse_dragged:         false,     // if mouse moved between mousedown and mouseup, if mousedown==mouseup can be that user returned to the exact same position
   nudge_opt:             20,        // microns to nudge tiles when using tile arrow nudge buttons or tile arrow keys
   nudge:                 100,       // microns to nudge tiles when using tile arrow nudge buttons or tile arrow keys
   nudge_shift:           200
  }
  tiles=                  [];        // tile information [{active: bool, fov: json, map: [[0 or 1]], original: {fov: fov stringified, map: map stringified}}]
  image=                  '';        // reference to currently loaded image
  images={
   optical:
   {name:                 'Optical',
    key:                  'optical', // name of key in images[]
    img:                  null,      // img object
    type:                 '',        // coregistration type: automatic or manual or json
    crop:                 0,         // number of pixels to crop from left and right
    coordinates:          [],        // coregistration coordinates, unscaled
    scale:                0,         // multiplier for current zoom
    transform:            {},        // coregistration coefficients, scaled
    brightness:           1,
    contrast:             1,
    loaded:               false      // true if image loaded into context, false if not
   },
   sed:
   {name:                 'SED',
    key:                  'sed',     // name of key in images[]
    img:                  null,      // img object
    type:                 'sed',     // coregistration type
    crop:                 0,         // number of pixels to crop from left and right
    coordinates:          [],        // coregistration coordinates, unscaled
    scale:                0,         // multiplier for current zoom
    transform:            {},        // coregistration coefficients, scaled
    brightness:           1,
    contrast:             1,
    loaded:               false      // true if image loaded into context, false if not
   },
   import:
   {name:                 'Import',
    key:                  'import',  // name of key in images[]
    img:                  null,      // img object
    type:                 'import',  // coregistration type
    crop:                 0,         // number of pixels to crop from left and right
    coordinates:          [],        // coregistration coordinates, unscaled
    scale:                0,         // multiplier for current zoom
    transform:            {},        // coregistration coefficients, scaled
    brightness:           1,
    contrast:             1,
    loaded:               false      // true if image loaded into context, false if not
  }}
  canvas={
   draw:                  null,      // main canvas draw layer
   draw_context:          null,      // main canvas draw layer context
   prerender:             null,      // prerender canvas draw
   prerender_context:     null,      // prerender canvas draw context/context before interactive drawing
   div:                   null,      // div containing canvas and slide
   optical_crop:          250,       // number of pixels to crop from left and right of optical images, user editable
   optical_bounds:        {left: 0.32, right: 0.68, top: 0.25, bottom: 1}, // rough slide boundaries in percentages, only used for warning user if possibly imaging outside these boundaries
   cursor_size:           27,        // default cursor size
   cursor_opacity:        0.8,       // default cursor opacity
   cursor_color:          '#fff',    // default cursor color
   slide_labels:          true,      // draw FOV labels onto slide image
   slide_labels_font:     'Source Sans Pro', // default tile label font
   slide_labels_size:     18,        // default tile label font size
   slide_focus_circles:   false,     // draw autofocus circles
   line_thickness:        2,         // default line thickness
   line_circle:           5,         // default detection radius for closing polygon and expanding tma
   line_color:            '#ffffff', // default line color
   line_colors:           [],        // list of background/line colors and accompanying text colors for tiles
   hover_line_opacity:    0.18,      // hovered tile line opacity
   hover_fill_opacity:    0.36,      // hovered tile line opacity
  }
  tma={
   crosshair:             3.5,       // tma positioning crosshair arm length
   line_opacity:          0.7,       // tma line transparency
   labels:                [],        // label map
   rows:                  1,         // number of tma rows
   columns:               1,         // number of tma columns
   row_start:             1,         // start index for row numbering
   column_start:          1,         // start index for coolumn numbering
   order:                 'tl0',     // default tma build order
   orders:                {tl0: [0, 1, 2, 3], tl1: [0, 3, 2, 1], tr0: [1, 2, 3, 0], tr1: [1, 0, 3, 2], br0: [2, 3, 0, 1], br1: [2, 1, 0, 3], bl0: [3, 0, 1, 2], bl1: [3, 2, 1, 0]},
   points:                0,         // number of points in corners
   corners:               [0, 0, 0, 0, 0, 0, 0, 0], // tma corner points in pixels
   corner_adjust:         -1,        // index of corner being adjusted
   corner_start:          {},
   revert:                ''         // stringified json prior to tma build
  }
  scratch={
   tiles:                 [],        // tile information for imported fovs, format same as tsai.tiles
   polygon:               [],        // array of coordinates for polygon [{x: x, y: y}]
   polygons:              [],        // coordinates for polygon import
   polygons_revert:       '',        // stringified json prior to polygon import
   corners:               {},        // coordinates of corners of tiled fovs
   shift:                 {}         // json correction coefficients for mibi shift
  }
  coordinates={
   optical:               [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']], // optical coordinates for manual coregistration, four pairs
   import:                [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']], // micron coordinates for json import, four pairs
   sed:                   [['', ''], ['', '']], // micron coordinates for full sed mode, two pairs
   crosshair:             10,        // coordinates crosshair arm length
   line_color_default:    '#ffffff', // default line color
   line_thickness:        3,         // coordinates line thickness
   line_opacity:          0.8,       // coordinates line opacity
   line_colors:           []         // list of background/line colors and accompanying text colors for coordinate boxes
  }
  
  /* ##########  USER FUNCTIONS  ########## */
  version(version)
  {if(!(tsai.mibi.version_latest in tsai.mibi.presets)) tsai.mibi.presets[tsai.mibi.version_latest]={};
   if(!(tsai.mibi.version_prior  in tsai.mibi.presets)) tsai.mibi.presets[tsai.mibi.version_prior ]={};
   var version=parseFloat(version);
   tsai.mibi.version=(!isNaN(version) && version>=parseFloat(tsai.mibi.version_latest)?tsai.mibi.version_latest:tsai.mibi.version_prior);
   var version_latest=(tsai.mibi.version==tsai.mibi.version_latest);
   if(document.getElementById('slide_focus_circles_tab' )) document.getElementById('slide_focus_circles_tab' ).style.display=(version_latest?'':'none');
   if(document.getElementById('json_group_autofocus_row')) document.getElementById('json_group_autofocus_row').style.display=(version_latest?'':'none');
   tsai.json_lists(true, true);
  }
  url_standalone(            bool         ) {tsai.url.standalone=!(bool==false || bool==0);}
  url_tsai(                  href         ) {tsai.url.tsai=href;}
  url_run_log(               href         ) {tsai.url.run_log=href;}
  url_mibi_tracker(          href         ) {tsai.url.mibi_tracker=href;}
  url_mibi_control(          href         ) {tsai.url.mibi_control=href;}
  url_mibi_configuration(    href         ) {tsai.url.mibi_configuration=href;}
  url_mibi_hv(               href         ) {tsai.url.mibi_hv=href;}
  url_mibi_service(          href         ) {tsai.url.mibi_service=href;}
  url_mibi_settings(         href         ) {tsai.url.mibi_settings=href;}
  coregistration_cookie(     name         ) {tsai.coregistration.cookie=name;}
  coregistration_default(    coordinates  ) {tsai.coregistration.default=coordinates;}
  focus_site_add(            site         ) {if(!tsai.mibi.focus_sites.includes(site  )) tsai.mibi.focus_sites.push(site  );}
  focus_only_add(            only         ) {if(!tsai.mibi.focus_onlys.includes(only  )) tsai.mibi.focus_onlys.push(only  );}
  fov_add(                   fov          ) {if(!tsai.mibi.fovs       .includes(fov   )) tsai.mibi.fovs       .push(fov   );}
  raster_add(                raster       ) {if(!tsai.mibi.rasters    .includes(raster)) tsai.mibi.rasters    .push(raster);}
  dwell_add(                 dwell, timing) {tsai.mibi.dwells.forEach((pair)=>{if(pair[0]==dwell && pair[1]==timing) return;}); tsai.mibi.dwells.push([dwell, timing]);}
  preset_add(                name , json  ) {tsai.mibi.presets['focusSite' in json?tsai.mibi.version_latest:tsai.mibi.version_prior][name]=json;}
  preset_recommended(        key, values  ) {tsai.mibi.recommended[key]=values;}
  optical_crop(              pixels       ) {tsai.canvas.optical_crop=pixels;}
  optical_bounds(            bounds       ) {tsai.canvas.optical_bounds=bounds;}
  action_nudge_opt(          microns      ) {tsai.action.nudge_opt=microns;}
  action_nudge(              microns      ) {tsai.action.nudge=microns;}
  action_nudge_shift(        microns      ) {tsai.action.nudge_shift=microns;}
  cursor_size(               pixels       ) {tsai.canvas.cursor_size=pixels;}
  cursor_opacity(            opacity      ) {tsai.canvas.cursor_opacity=opacity;}
  slide_labels(              bool         ) {tsai.canvas.slide_labels=bool;}
  slide_labels_font(         font         ) {tsai.canvas.slide_labels_font=font;}
  slide_labels_size(         size         ) {tsai.canvas.slide_labels_size=size;}
  line_thickness(            pixels       ) {tsai.canvas.line_thickness=pixels;}
  line_circle(               pixels       ) {tsai.canvas.line_circle=pixels;}
  line_color_default(        color        ) {tsai.canvas.line_color=color;}
  line_color_add(            color, text  ) {tsai.canvas.line_colors.push([color, text]);}
  hover_line_opacity(        opacity      ) {tsai.canvas.hover_line_opacity=opacity;}
  hover_fill_opacity(        opacity      ) {tsai.canvas.hover_fill_opacity=opacity;}
  tma_crosshair(             pixels       ) {tsai.tma.crosshair=pixels;}
  tma_line_opacity(          opacity      ) {tsai.tma.line_opacity=opacity;}
  coordinates_color_add(     color, text  ) {tsai.coordinates.line_colors.push([color, text]);}
  coordinates_crosshair(     pixels       ) {tsai.coordinates.crosshair=pixels;}
  coordinates_line_thickness(pixels       ) {tsai.coordinates.line_thickness=pixels;}
  coordinates_line_opacity(  opacity      ) {tsai.coordinates.line_opacity=opacity;}
  
  
  /* #################################
     #################################
     ##########             ##########
     ##########   STARTUP   ##########
     ##########             ##########
     #################################
     ################################# */
  
  onload()
  {tsai.url_tsai(window.location.protocol+'//'+window.location.host+window.location.pathname);
   if(tsai.url.standalone)
   {var urls=[
     ['url_run_log'           , tsai.url.run_log],
     ['url_mibi_tracker'      , tsai.url.mibi_tracker],
     ['url_mibi_control'      , tsai.url.mibi_control],
     ['url_mibi_configuration', tsai.url.mibi_configuration],
     ['url_mibi_hv'           , tsai.url.mibi_hv],
     ['url_mibi_service'      , tsai.url.mibi_service],
     ['url_mibi_settings'     , tsai.url.mibi_settings],
     ['url_mibi_documentation', (tsai.url.mibi_tracker==''?'':tsai.url.mibi_tracker+(tsai.url.mibi_tracker.charAt(tsai.url.mibi_tracker.length-1)=='/'?'':'/')+'tracker/about')]];
    urls.forEach((url)=>{if(url[1]!='') document.getElementById(url[0]).children[0].href=url[1]; else document.getElementById(url[0]).style.display='none';});
   }
   Object.keys(tsai.images).forEach((image)=>{tsai.images[image].img=document.getElementById('image_'+image);});
   tsai.canvas.div_slide=document.getElementById('slide');
   tsai.canvas.div_image=document.getElementById('slide_image');
   tsai.canvas.draw=document.getElementById('canvas_draw');
   tsai.canvas.draw_context=tsai.canvas.draw.getContext('2d');
   tsai.canvas.prerender=document.getElementById('canvas_prerender');
   tsai.canvas.prerender_context=tsai.canvas.prerender.getContext('2d');
   // set event listeners
   tsai.canvas.draw.addEventListener('mouseover', function(event) {tsai.action_event('mouseover', event);}, false);
   tsai.canvas.draw.addEventListener('mousedown', function(event) {tsai.action_event('mousedown', event);}, false);
   tsai.canvas.draw.addEventListener('mousemove', function(event) {tsai.action_event('mousemove', event);}, false);
   tsai.canvas.draw.addEventListener('mouseup'  , function(event) {tsai.action_event('mouseup'  , event);}, false);
   tsai.canvas.draw.addEventListener('mouseout' , function(event) {tsai.action_event('mouseout' , event);}, false);
   tsai.canvas.draw.addEventListener('dblclick' , function(event) {tsai.action_event('dblclick' , event);}, false);
   document        .addEventListener('keydown'  , function(event) {tsai.action_event('keydown',   event);}, false);
   document        .addEventListener('drop'     , function(event) {event.stopPropagation(); event.preventDefault(); tsai.files_drop(event, tsai.files_sort);}, false);
   document        .addEventListener('dragenter', function(event) {event.stopPropagation(); event.preventDefault();}, false);
   document        .addEventListener('dragover' , function(event) {event.stopPropagation(); event.preventDefault();}, false);
   // miscellaneous cosmetic setup
   tsai.tiles=tsai.json_load('{"exportDateTime": "'+tsai.time_format().json+'", "fovFormatVersion": "'+tsai.mibi.version+'", "fovs": []}');
   document.getElementById('labels_table'        ).style.width=(parseFloat(document.getElementById('tiles_scroll').getBoundingClientRect().right)-80)+'px';
   document.getElementById('slide_cursor_size'   ).value=tsai.canvas.cursor_size;
   document.getElementById('slide_cursor_opacity').value=tsai.canvas.cursor_opacity;
   document.getElementById('slide_line_thickness').value=tsai.canvas.line_thickness;
   document.getElementById('slide_tma_crosshair' ).value=tsai.tma.crosshair;
   document.getElementById('slide_labels'        ).checked=tsai.canvas.slide_labels;
   document.getElementById('slide_labels_size'   ).value=tsai.canvas.slide_labels_size;
   tsai.version(tsai.mibi.version);
   tsai.draw_cursor();
   for(var index=0; index<4; index++)
   {for(var system=0; system<2; system++)
    {for(var axis=0; axis<2; axis++)
     {for(var action=0; action<2; action++)
      {for(var color=0; color<2; color++) document.getElementById(['optical', 'import'][action]+'_coordinates_'+index+'_'+system+'_'+['x', 'y'][axis]).style[['backgroundColor', 'color'][color]]=tsai.coordinates.line_colors[index][color];
   }}}}
   for(var index=0; index<2; index++)
   {for(var axis=0; axis<2; axis++)
    {for(var color=0; color<2; color++) document.getElementById('sed_coordinates_'+index+'_'+['x', 'y'][axis]).style[['backgroundColor', 'color'][color]]=tsai.coordinates.line_colors[index][color];
   }}
   for(var axis=0; axis<2; axis++)
   {for(var move=0; move<2; move++)
    {for(var color=0; color<2; color++) document.getElementById('sed_shift_'+['x', 'y'][axis]+'_'+['x', 'y'][move]).style[['backgroundColor', 'color'][color]]=tsai.coordinates.line_colors[3][color];
   }}
   for(var side=0; side<2; side++)
   {for(var color=0; color<2; color++) document.getElementById('sed_crop_'+side).style[['backgroundColor', 'color'][color]]=tsai.coordinates.line_colors[3][color];
   }
   // load coregistration from cookie or search string
   tsai.coregistration_load();
  }
  
  
  /* ###########################################
     ###########################################
     ##########                       ##########
     ##########   GENERAL FUNCTIONS   ##########
     ##########                       ##########
     ###########################################
     ########################################### */
  
  /* ##########  COOKIES  ########## */
  cookie_set(x,y) {document.cookie=x+'='+y+'; expires='+(new Date(2888,1,1,0,0,0))+'; domain='+window.location.hostname+'; samesite=strict; path=/;';}
  cookie_get(x) {var x=document.cookie.match('(^|;) ?'+x+'=([^;]*)(;|$)'); return (x?x[2]:null);}
  
  /* ##########  ARRAY  ########## */
  // JavaScript requires an copy_array function rather than just assignment operator because array variables are passed by reference.
  copy_array(array_from)
  {var array_to=[];
   for(var index=0; index<array_from.length; index++)
   {if(Array.isArray(array_from[index])) array_to[index]=tsai.copy_array(array_from[index]);
    else array_to[index]=array_from[index];
   }
   return array_to;
  }
  
  /* ########## OBJECT  ########## */
  // A more general case of copy_array
  copy_object(object_from)
  {if(typeof object_from==='object')
   {if(Array.isArray(object_from))
    {var object_to=[];
     for(var index=0; index<object_from.length; index++) object_to[index]=tsai.copy_object(object_from[index]);
     return object_to;
    }
    else
    {var object_to={};
     var keys=Object.keys(object_from);
     for(var key=0; key<keys.length; key++) object_to[keys[key]]=tsai.copy_object(object_from[keys[key]]);
     return object_to;
   }}
   if(object_from===null) return false;
   // if(typeof object_from==='function') return object_from;
   return object_from;
  }
  
  /* ##########  FOVS BUILD ARRAY  ########## */
  // array of {fov:reference to fov, tile:tile_index, focus_x:x, focus_y:y, time:seconds}
  copy_fovs_build(array_from)
  {var array_to=[];
   for(var index=0; index<array_from.length; index++)
   {array_to[index]={};
    var keys=Object.keys(array_from[index]);
    for(var key=0; key<keys.length; key++) array_to[index][keys[key]]=array_from[index][keys[key]];
   }
   return array_to;
  }
  
  /* ##########  TIME  ########## */
  time_pad(number) {if(String(number).length==1) return '0'+number; else return String(number);}
  
  time_format(time) // time is formatted to a Date object
  {if(time=='' || time==null || time==undefined) time=new Date();
   else if(time instanceof Array) time=new Date(time[1], time[2], time[3], time[4], time[5], time[6]);
   var extract=
   {ymd: time.getFullYear()+'-'+tsai.time_pad(time.getMonth()+1)+'-'+tsai.time_pad(time.getDate()),
    h24: tsai.time_pad(time.getHours()),
    h12: time.getHours()%12==0?12:time.getHours()%12,
    m: tsai.time_pad(time.getMinutes()),
    s: tsai.time_pad(time.getSeconds()),
    ms: tsai.time_pad(time.getMilliseconds()),
    json: time.toJSON().substring(0, 19),
    ampm: (time.getHours()>=12?' PM':' AM')
   };
   return {
    // mdy: (time.getMonth()+1)+'/'+time.getDate()+'/'+time.getFullYear(),
    // hms12c: extract.h12+':'+extract.m+':'+extract.s+extract.ampm,
    // hm24c: extract.h24+':'+extract.m,
    // json: extract.ymd+'T'+extract.h24+':'+extract.m+':'+extract.json.substring(17,19),
    ymd: extract.ymd,
    ymdhmsm: extract.ymd+'-'+extract.h24+extract.m+extract.s+extract.ms,
    ymdhms: extract.ymd+'-'+extract.h24+extract.m+extract.s,
    hms24: extract.h24+extract.m+extract.s,
    hms24c: extract.h24+':'+extract.m+':'+extract.s,
    hm12c: extract.h12+':'+extract.m+extract.ampm,
    json: extract.ymd+'T'+extract.h24+':'+extract.m+':00',
    readable: extract.ymd+' at '+extract.h12+':'+extract.m+extract.ampm
   };
  }
  
  /* ##########  POSITIONING  ########## */
  element_position(element)
  {var left=0;
   var top=0;
   if(element.offsetParent)
   {do
    {left+=element.offsetLeft;
     top+=element.offsetTop;
    } while (element=element.offsetParent);
    return {top: top, left: left};
  }}
  
  /* ##########  TOGGLE  ########## */
  element_toggle(element)
  {if((typeof element=='object'?element:document.getElementById(element)).innerHTML.replace(/<.+?>/g, '').includes('[+]')) tsai.element_toggle_on(element);
   else tsai.element_toggle_off(element);
  }
  
  element_toggle_on(element)
  {var object=(typeof element=='object'?element:document.getElementById(element));
   object.innerHTML=object.innerHTML.replace(/\[.+?\]/, '[&minus;]');
   object.nextElementSibling.style.display='';
  }
  
  element_toggle_off(element)
  {var object=(typeof element=='object'?element:document.getElementById(element)); 
   object.innerHTML=object.innerHTML.replace(/\[.+?\]/, '[+]');
   object.nextElementSibling.style.display='none';
  }
  
  /* ##########  MENUS  ########## */
  menus_close(except)
  {if(typeof except=='undefined') except=[];
   if(typeof except=='string') except=[except];
   var success=true;
   if(!except.includes('tma'    )) success=tsai.tma_close();
   if(!except.includes('labels' )) tsai.labels_close();
   if(!except.includes('polygon')) tsai.polygon_close();
   if(!except.includes('copy'   )) tsai.copy_close();
   return success;
  }
  
  
  /* ##########################################
     ##########################################
     ##########                      ##########
     ##########   MATRIX FUNCTIONS   ##########
     ##########                      ##########
     ##########################################
     ##########################################
  
     adapted from https://github.com/jlouthan/perspective-transform
     tsai.matrix_perspective(from, into, ?inverse) returns a set of coefficients, where ?inverse is a boolean for whether (true) or not (false) to calculate the reverse coefficients
     tsai.matrix_perspective_transform(coefficients, from) returns the transformation from -> into
     tsai.matrix_perspective_reverse(  coefficients, into) returns the transformation into -> from
  */
  matrix_diagonal(vector)
  {var vector_length=vector.length;
   var diagonal=[];
   for(var row=0; row<vector_length; row++)
   {var index=diagonal.push([])-1;
    for(var column=0; column<vector_length; column++) diagonal[index].push(row==column?0:vector[index]);
   }
   return diagonal;
  }
  
  matrix_identity(length)
  {var identity=new Array(length);
   for(var row=0; row<length; row++)
   {identity[row]=new Array(length);
    for(var column=0; column<length; column++) identity[row][column]=(row==column?1:0);
   }
   return identity;
  }
  
  matrix_inverse(matrix)
  {// A[0...m][0...n]
   var m=matrix.length;
   var n=matrix[0].length;
   var A=tsai.copy_array(matrix)
   var inverse=tsai.matrix_identity(m);
   for(var j=0; j<n; j++)
   {var i0=-1;
    var v0=-1;
    for(var i=j; i!==m; i++)
    {k=Math.abs(A[i][j]);
     if(k>v0)
     {i0=i;
      v0=k;
    }}
    var Aj=A[i0];
    A[i0]=A[j];
    A[j]=Aj;
    var Ij=inverse[i0];
    inverse[i0]=inverse[j];
    inverse[j]=Ij;
    var x=Aj[j];
    for(var k=j; k!==n; k++) Aj[k]/=x;
    for(var k=n-1; k!==-1; k--) Ij[k]/=x;
    for(i=m-1; i!==-1; i--)
    {if(i!==j)
     {var Ai=A[i];
      var Ii=inverse[i];
      x=Ai[j];
      for(k=j+1; k!==n; k++)
      Ai[k]-=Aj[k]*x;
      for(k=n-1; k>0; k--)
      {Ii[k]-=Ij[k]*x;
       k--;
       Ii[k]-=Ij[k]*x;
      }
      if(k===0) Ii[0]-=Ij[0]*x;
   }}}
   return inverse;
  }
  
  matrix_transpose(matrix)
  {// matrix[0...m][0...n] -> transpose[row][column]
   var m=matrix.length;
   var n=matrix[0].length;
   var transpose=new Array(n);
   for(var row=0; row<n; row++)
   {transpose[row]=new Array(m);
    for(var column=0; column<m; column++) transpose[row][column]=matrix[column][row];
   }
   return transpose;
  }
  
  matrix_dot_matrix(matrix0, matrix1)
  {// matrix0[0...p][0...q], matrix1[0...q][0...r] -> product[0...p][0...r]
   var p=matrix0.length;
   var q=matrix1.length;
   var r=matrix1[0].length;
   var product=new Array(p);
   for(var row=0; row<p; row++)
   {product[row]=new Array(r);
    for(var column=0; column<r; column++)
    {var sum=0;
     for(var i=0; i<q; i++) sum+=matrix0[row][i]*matrix1[i][column];
     product[row][column]=sum;
   }}
   return product;
  }
  
  matrix_dot_vector(matrix, vector)
  {// matrix[0...p][0...q], vector[0...q] -> vector[0...p]
   var p=matrix.length;
   var q=vector.length;
   var product=new Array(q);
   for(var row=0; row<p; row++)
   {var sum=0;
    for(var column=0; column<q; column++) sum+=matrix[row][column]*vector[column];
    product[row]=sum;
   }
   return product;
  }
  
  matrix_perspective_coefficients(from, into)
  {var A=[
    [from[0], from[1], 1, 0, 0, 0, -into[0]*from[0], -into[0]*from[1]],
    [0, 0, 0, from[0], from[1], 1, -into[1]*from[0], -into[1]*from[1]],
    [from[2], from[3], 1, 0, 0, 0, -into[2]*from[2], -into[2]*from[3]],
    [0, 0, 0, from[2], from[3], 1, -into[3]*from[2], -into[3]*from[3]],
    [from[4], from[5], 1, 0, 0, 0, -into[4]*from[4], -into[4]*from[5]],
    [0, 0, 0, from[4], from[5], 1, -into[5]*from[4], -into[5]*from[5]],
    [from[6], from[7], 1, 0, 0, 0, -into[6]*from[6], -into[6]*from[7]],
    [0, 0, 0, from[6], from[7], 1, -into[7]*from[6], -into[7]*from[7]]];
   var B=into;
   var C;
   try {C=tsai.matrix_inverse(tsai.matrix_dot_matrix(tsai.matrix_transpose(A), A));}
   catch(error) {console.log(error); return [1,0,0,0,1,0,0,0];}
   var D=tsai.matrix_dot_matrix(C, tsai.matrix_transpose(A));
   var coefficients=tsai.matrix_dot_vector(D, B);
   return coefficients;
  }
  
  matrix_perspective(from, into, inverse)
  {var coefficients={transform: tsai.matrix_perspective_coefficients(from, into)};
   if(inverse) coefficients.reverse=tsai.matrix_perspective_coefficients(into, from);
   return coefficients;
  }
  
  matrix_perspective_transform(coefficients, coordinates)
  {return {
   x: (coefficients.transform[0]*coordinates.x+coefficients.transform[1]*coordinates.y+coefficients.transform[2])/(coefficients.transform[6]*coordinates.x+coefficients.transform[7]*coordinates.y+1),
   y: (coefficients.transform[3]*coordinates.x+coefficients.transform[4]*coordinates.y+coefficients.transform[5])/(coefficients.transform[6]*coordinates.x+coefficients.transform[7]*coordinates.y+1)};
  }
  
  matrix_perspective_reverse(coefficients, coordinates)
  {return {
   x: (coefficients.reverse[0]*coordinates.x+coefficients.reverse[1]*coordinates.y+coefficients.reverse[2])/(coefficients.reverse[6]*coordinates.x+coefficients.reverse[7]*coordinates.y+1),
   y: (coefficients.reverse[3]*coordinates.x+coefficients.reverse[4]*coordinates.y+coefficients.reverse[5])/(coefficients.reverse[6]*coordinates.x+coefficients.reverse[7]*coordinates.y+1)};
  }
  
  
  /* ##################################################
     ##################################################
     ##########                              ##########
     ##########   GENERAL ACTION FUNCTIONS   ##########
     ##########                              ##########
     ##################################################
     ################################################## */
  
  action_position(event)
  {var canvas_rect=tsai.canvas.draw.getBoundingClientRect();
   return {x: event.clientX-canvas_rect.left+tsai.image.crop, y: event.clientY-canvas_rect.top};
  }
  
  action_event(type, event)
  {var position=tsai.action_position(event);
   switch(type)
   {case 'keydown':
     tsai.draw_key(type, event, position);
     break;
    case 'mousedown':
     tsai.action.mouse_down=position;
     tsai.action.mouse_dragged=false;
     break;
    case 'mousemove':
     if('x' in tsai.action.mouse_down && (position.x!=tsai.action.mouse_down.x || position.y!=tsai.action.mouse_down.y)) tsai.action.mouse_dragged=true;
     var microns=tsai.coregistration_to_micron(tsai.image.transform, position);
     document.getElementById('slide_x_microns').value=Math.round(microns .x*100)/100;
     document.getElementById('slide_y_microns').value=Math.round(microns .y*100)/100;
     document.getElementById('slide_x_pixels' ).value=Math.round(position.x*100)/100;
     document.getElementById('slide_y_pixels' ).value=Math.round(position.y*100)/100;
     break;
    case 'mouseout':
     tsai.action.mouse_down={};
     tsai.action.mouse_dragged=false;
     document.getElementById('slide_x_pixels' ).value='';
     document.getElementById('slide_y_pixels' ).value='';
     document.getElementById('slide_x_microns').value='';
     document.getElementById('slide_y_microns').value='';
     break;
   }
   switch(tsai.action.type)
   {case 'move'     : tsai.move_action(     type, event, position); break;
    case 'click'    : tsai.click_action(    type, event, position); break;
    case 'erase'    : tsai.erase_action(    type, event, position); break;
    case 'duplicate': tsai.duplicate_action(type, event, position); break;
    case 'polygon'  : tsai.polygon_action(  type, event, position); break;
    case 'tma'      : tsai.tma_action(      type, event, position); break;
    case 'optical'  : tsai.optical_action(  type, event, position); break; // manual coregistration
    case 'import'   : tsai.import_action(   type, event, position); break;
    case 'sed'      : tsai.sed_action(      type, event, position); break;
   }
   if(type=='mouseup')
   {tsai.action.mouse_down={};
    tsai.action.mouse_dragged=false; // mouseup actions need to occur AFTER the action functions
  }}
  
  action_clear(radios)
  {tsai.action.type='';
   tsai.action.item=null;
   if(radios)
   {var radios=document.getElementsByName('action_radio');
    var radios_length=radios.length;
    for(var radio=0; radio<radios_length; radio++) radios[radio].checked=false;
  }}
  
  /* ##########  PRERENDER  ########## */
  action_prerender(action, tile, all)
  {if(!tsai.image.loaded)
   {tsai.action_clear(false);
    return;
   }
   if(action!='hover')
   {tsai.action.type=action;
    tsai.action.item=tile;
   }
   tsai.tiles_draw(tsai.canvas.prerender_context, all?[]:[tile]);
  }
  
  
  /* #########################################
     #########################################
     ##########                     ##########
     ##########   FILES FUNCTIONS   ##########
     ##########                     ##########
     #########################################
     ######################################### */
  
  files_drop(event, handler)
  {event.preventDefault();
   if(event.dataTransfer.items)
   {[...event.dataTransfer.items].forEach((item) =>
    {if(item.kind==='file')
     {var file=item.getAsFile();
      handler(file);
   }});}
   else {[...event.dataTransfer.files].forEach((file)=>{handler(file);});}
  }
  
  files_drag_over(div)
  {document.getElementById(div).style.backgroundColor='var(--button_green)';
  }
  
  files_drag_leave(div)
  {document.getElementById(div).style.backgroundColor='';
  }
  
  files_load(input, handler)
  {Array.from(input.files).forEach((file)=>{handler(file);});
  }
  
  files_sort(file)
  {var extension=file.name.substring(file.name.lastIndexOf('.'));
   if(extension=='.json')
   {document.getElementById('files_json').innerHTML=file.name;
    document.getElementById('files_json').style.display='';
    tsai.json_read(file);
    if(document.getElementById('files_image').innerHTML.length>8) tsai.element_toggle_off('files_toggle');
   }
   else if(extension=='.txt') tsai.navigation_adjust_file(file);
   else if(['.png', '.bmp', '.jpg', '.jpeg'].includes(extension))
   {var shift=file.name.replace(/\.png$/, '').replace(/(^|[^\d])\./g, '$10.').match(/sed_\[(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*)\]$/);
    if(shift)
    {tsai.sed_shift_set(shift);
     return;
    }
    document.getElementById('files_image').innerHTML=file.name;
    document.getElementById('files_image').style.display='';
    var sed=file.name.replace(/\.png$/, '').replace(/(^|[^\d])\./g, '$10.').match(/sed_\d\d\d\d\-\d\d\-\d\d\-\d\d\d\d\d\d_\([\-\d\.,]+\)/);
    if(sed)
    {tsai.image_load('sed', file, 0);
     if(document.getElementById('files_json').innerHTML.length>8) tsai.element_toggle_off('files_toggle');
    }
    else
    {tsai.image_load('optical', file, tsai.canvas.optical_crop);
     if(document.getElementById('files_json').innerHTML.length>8) tsai.element_toggle_off('files_toggle');
  }}}
  
  files_append(file)
  {var extension=file.name.substring(file.name.lastIndexOf('.'));
   if(extension=='.json')
   {document.getElementById('files_appended').innerHTML+=(document.getElementById('files_appended').innerHTML.trim()==''?'':'<br/>')+file.name;
    document.getElementById('files_appended').style.display='';
    tsai.json_append(file);
  }}
  
  
  /* ##########################################
     ##########################################
     ##########                      ##########
     ##########   LABELS FUNCTIONS   ##########
     ##########                      ##########
     ##########################################
     ########################################## */
  
  labels_insert(text)
  {var textarea=document.getElementById('labels_map');
   var start=textarea.selectionStart;
   var end  =textarea.selectionEnd;
   textarea.value=textarea.value.substr(0, start)+text+textarea.value.substr(end);
   if(start==end) textarea.setSelectionRange(end+1, end+1);
   else textarea.setSelectionRange(end, end);
   textarea.focus();
   tsai.labels_load();
  }
  
  labels_load()
  {var textarea=document.getElementById('labels_map');
   if(textarea.value.trim()=='') return;
   tsai.tma.labels=[];
   var b='';
   var columns=0;
   var rows=textarea.value.split('\n');
   for(var row=0; row<rows.length; row++)
   {tsai.tma.labels.push([]);
    b+='\n<tr><td>'+(row+1)+'</td>';
    var cells=rows[row].replace(/\s+$/, '').split('\t');
    if(cells.length>columns) columns=cells.length;
    for(var cell=0; cell<cells.length; cell++)
    {if(cells[cell].trim()=='')
     {tsai.tma.labels[row].push('');
      b+='<td>&nbsp;</td>';
     }
     else
     {tsai.tma.labels[row].push(cells[cell].replace('\\n', ' ').replace(/\s+/g, ' ').trim());
      b+='<td><span onclick="tsai.tile_labels_select('+row+', '+cell+');">'+cells[cell].trim().replace('<', '&lt;').replace('>', '&gt;').replace('\\n', '<br/>')+'</span></td>';
    }}
    b+='</tr>';
   }
   b+='\n</table>';
   var header='\n <tr><td>&nbsp;</td>';
   for(var column=0; column<columns; column++) header+='<td>'+(column+1)+'</td>';
   header+='</tr>';
   document.getElementById('tile_labels').innerHTML='<div><span onclick="tsai.tile_labels_close();">Close [&times;]</span></div>\n<table>'+header+b;
  }
  
  labels_build(tile)
  {if(!tsai.menus_close()) return;
   document.getElementById('labels_tile').value=tile;
   var textarea=document.getElementById('labels_map');
   if(textarea.value.trim()=='') {tsai.labels_close(); return;}
   else tsai.labels_load();
   var name=document.getElementById('tile_'+tile+'_name');
   var div=document.getElementById('tile_labels');
   div.style.display='';
   div.style.top=0;
   div.style.top=(tsai.element_position(name).top-tsai.element_position(div).top+name.offsetHeight+3)+'px';
   div.style.left='8px';
  }
  
  labels_select(row, column)
  {if(!tsai.menus_close()) return;
   var tile=parseInt(document.getElementById('labels_tile').value);
   if(!isNaN(tile))
   {var value=tsai.tma.labels[row][column];
    tsai.tiles[tile].fov.name=value;
    document.getElementById('tile_'+tile+'_name').value=value.replace('&lt;', '<').replace('&gt;', '>');
  }}
  
  labels_close()
  {if(document.getElementById('tile_labels')) document.getElementById('tile_labels').style.display='none';
   document.getElementById('labels_tile').value='';
  }
  
  
  /* #########################################
     #########################################
     ##########                     ##########
     ##########   IMAGE FUNCTIONS   ##########
     ##########                     ##########
     #########################################
     ######################################### */
  
  /* ##########  IMAGE LOAD  ########## */
  /* Load images into canvas.images, then call image_tab
     Types are sed, optical, and import
  */
  image_load(key, file, crop)
  {var file_reader=new FileReader();
   file_reader.readAsDataURL(file);
   file_reader.onload=function()
   {tsai.images[key].img.src=file_reader.result;
    tsai.images[key].img.onload=function()
    {tsai.images[key].crop=crop;
     tsai.images[key].brightness=1;
     tsai.images[key].contrast=1;
     if(key=='sed') tsai.coregistration_set('sed', file.name, tsai.time_format(file.name.match(/(\d\d\d\d)\-(\d\d)\-(\d\d)\-(\d\d)(\d\d)(\d\d)/)).readable);
     else if(key=='optical')
     {if(tsai.images[key].coordinates.length==2 && tsai.images[key].coordinates[1][2]==1)
      {var pixels=[0, 0, tsai.images[key].img.naturalWidth, 0, 0, tsai.images[key].img.naturalHeight, tsai.images[key].img.naturalWidth, tsai.images[key].img.naturalHeight];
       var quads='';
       for(var quad=0; quad<4; quad++) quads+=pixels[2*quad]+','+pixels[(2*quad)+1]+','+(tsai.images[key].coordinates[0][2*quad]/1000)+','+(tsai.images[key].coordinates[0][(2*quad)+1]/1000)+'|';
       tsai.coregistration_set('automatic', quads, tsai.time_format().readable);
     }}
     tsai.images[key].loaded=true; // must be AFTER coregistration_set('sed' ...
     document.getElementById('json_image_save').style.display='';
     tsai.image_tab(key, (tsai.images[key].img.naturalWidth>1500 || tsai.images[key].img.naturalHeight>1500)?0.5:1);
     setTimeout(()=>{tsai.draw_reset();}, 100); // I have no idea why I have to do this but otherwise tiles are drawn a few pixels off
  }}}
  
  /* ##########  IMAGE TAB (ZOOM/SCALE)  ########## */
  image_tab(key, scale)
  {/* key  : which image in tsai.images to write, e.g. 'optical' or 'sed'
      scale: scaling factor for image magnification, from 0.1 to 2
   */
   if(!tsai.menus_close()) return;
   if(isNaN(scale) || typeof scale=='string') scale=tsai.image.scale;
   tsai.image=tsai.images[key];
   if(!tsai.image.loaded) return;
   tsai.image.crop=(key=='sed'?0:tsai.canvas.optical_crop*scale);
   var width=tsai.image.img.naturalWidth*scale;
   var height=tsai.image.img.naturalHeight*scale;
   tsai.image.img.width=width;
   tsai.image.img.height=height;
   tsai.image.img.style.width=width+'px';
   tsai.image.img.style.height=height+'px';
   tsai.image.img.style.marginLeft=-tsai.image.crop+'px';
   tsai.image.img.style.filter='brightness('+tsai.image.brightness+') contrast('+tsai.image.contrast+')';
   tsai.canvas.div_image.style.width=width+'px';
   tsai.canvas.div_image.style.height=height+'px';
   width-=2*tsai.image.crop;
   tsai.canvas.draw.width=width;
   tsai.canvas.draw.height=height;
   tsai.canvas.prerender.width=width;
   tsai.canvas.prerender.height=height;
   tsai.canvas.div_slide.style.height=height+'px';
   tsai.canvas.div_slide.style.width=(width+17)+'px';
   // tsai.canvas.div_slide.style.width=(width+(window.innerHeight<height-80?17:0))+'px';
   tsai.image.scale=scale;
   Object.keys(tsai.images).forEach((image)=>{tsai.images[image].img.style.display=(image==key?'block':'none');});
   document.getElementById('tiles_scroll').style.height=tsai.canvas.draw.height+'px';
   if(scale==1) tsai.image.transform=tsai.matrix_perspective(tsai.image.coordinates[0], tsai.image.coordinates[1], true);
   else tsai.image.transform=tsai.matrix_perspective(tsai.image.coordinates[0], tsai.image.coordinates[1].map(function(number){return number*scale;}), true);
   var b='';
   if(tsai.images.optical.loaded) b+='<span class="image_tab '+(tsai.image.key=='optical'?'active':'inactive')+'" onclick="tsai.image_tab_reset(\'optical\');">Optical</span>';
   if(tsai.images.sed    .loaded) b+='<span class="image_tab '+(tsai.image.key=='sed'    ?'active':'inactive')+'" onclick="tsai.image_tab_reset(\'sed\');">SED</span>';
   document.getElementById('slide_tabs').innerHTML=b;
   document.getElementById('slide_zoom').value=Math.round(scale*1000)/1000;
  }
  
  image_tab_reset(key)
  {tsai.image_tab(key, tsai.images[key].scale);
   if(['optical', 'sed', 'import'].includes(tsai.action.type)) tsai.action_clear(true);
   setTimeout(()=>{tsai.draw_reset();}, 100);
  }
  
  /* ##########  IMAGE SAVE  ########## */
  image_save(tiles)
  {if(!tsai.menus_close('labels')) return;
   // if(!tsai.image.loaded) return;
   var canvas=document.createElement('canvas');
   var context=canvas.getContext('2d');
   canvas.style='display:none;';
   canvas.width=tsai.image.img.width;
   canvas.height=tsai.image.img.height;
   document.body.appendChild(canvas);
   context.filter='brightness('+tsai.image.brightness+') contrast('+tsai.image.contrast+')';
   context.drawImage(tsai.image.img, tsai.image.crop/tsai.image.scale, 0, tsai.image.img.naturalWidth, tsai.image.img.naturalHeight, 0, 0, tsai.image.img.width, tsai.image.img.height);
   context.filter='brightness(1) contrast(1)';
   if(tiles) context.drawImage(tsai.canvas.draw, 0, 0);
   canvas.toBlob(
    (blob)=>
    {let url=window.URL || window.webkitURL;
    let anchor=document.createElement('a');
    anchor.href=url.createObjectURL(blob);
    anchor.download=tsai.json.name+'_'+tsai.time_format().ymdhms+'.png';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
   });
  }
  
  
  /* ########################################
     ########################################
     ##########                    ##########
     ##########   JSON FUNCTIONS   ##########
     ##########                    ##########
     ########################################
     ######################################## */
  
  json_equal(json0, json1)
  {// return JSON.stringify(json0)==JSON.stringify(json1);
   var keys0=(json0==null?[]:Object.keys(json0));
   var keys1=(json1==null?[]:Object.keys(json1));
   // if(keys0.length!=keys1.length) return false;
   var keys0_length=keys0.length;
   for(var key=0; key<keys0_length; key++)
   {if(keys0[key]=='notes') continue;
    if(!keys1.includes(keys0[key])) return false;
    if(keys0[key]=='x' || keys0[key]=='y')
    {if(Math.abs(json0[keys0[key]]-json1[keys0[key]])>5) return false; // sets threshold for json_load _R#C# tiling to 5 microns
    }
    else if(typeof json0[keys0[key]]=='object')
    {if(typeof json1[keys0[key]]=='object')
     {if(!tsai.json_equal(json0[keys0[key]], json1[keys0[key]])) return false;
     }
     else return false;
    }
    else {if(json0[keys0[key]]!=json1[keys0[key]]) return false;}
   }
   return true;
  }
  
  json_equal_strict(json0, json1)
  {// return JSON.stringify(json0)==JSON.stringify(json1);
   var keys0=(json0==null?[]:Object.keys(json0));
   var keys1=(json1==null?[]:Object.keys(json1));
   if(keys0.length!=keys1.length) return false;
   var keys0_length=keys0.length;
   for(var key=0; key<keys0_length; key++)
   {if(keys0[key]=='notes') continue;
    if(!keys1.includes(keys0[key])) return false;
    if(keys0[key]=='x' || keys0[key]=='y')
    {if(Math.abs(json0[keys0[key]]!=json1[keys0[key]])) return false; // sets threshold for json_load _R#C# tiling to 5 microns
    }
    else if(typeof json0[keys0[key]]=='object')
    {if(typeof json1[keys0[key]]=='object')
     {if(!tsai.json_equal(json0[keys0[key]], json1[keys0[key]])) return false;
     }
     else return false;
    }
    else {if(json0[keys0[key]]!=json1[keys0[key]]) return false;}
   }
   return true;
  }
  
  array_equal(array0, array1)
  {var length=array0.length;
   if(length!=array1.length) return false;
   for(var index=0; index<length; index++)
   {if(Array.isArray(array0[index]))
    {if(!Array.isArray(array1[index])) return false;
     if(!tsai.array_equal(array0[index], array1[index])) return false;
    }
    else if(array0[index]!=array1[index]) return false;
   }
   return true;
  }
  
  json_parse_id(tile, key)
  {if(!(key in tile.fov)) return 0;
   var value=parseInt(tile.fov[key]);
   if(isNaN(value)) return 0;
   return Math.abs(value);
  }
  
  json_parse_preset(tile, warnings)
  {var preset=tile.fov.imagingPreset;
   var keys=Object.keys(tsai.mibi.presets[tsai.mibi.version]);
   for(var key=0; key<keys.length; key++)
   {if(tsai.json_equal(preset, tsai.mibi.presets[tsai.mibi.version][keys[key]].imagingPreset)) return;
   }
   var name=tile.fov.name+' '+preset.displayName;
   tsai.mibi.presets[tsai.mibi.version][name]=JSON.parse(JSON.stringify(tile.fov));
   warnings('<li>'+(tile.fov.name.trim()!=''?tile.fov.name:'Tile '+(tile+1))+' settings not in presets, added as '+name+'</li>');
  }
  
  /* ##########  WARNINGS  ########## */
  json_warnings(warnings)
  {if(warnings=='') return false;
   var div=document.getElementById('json_warnings');
   warnings.split('<li>').filter((warning)=>(warning.trim()!='' && !div.innerHTML.includes('<li>'+warning))).forEach((warning)=>
   {var innerhtml=div.innerHTML;
    var index=innerhtml.lastIndexOf('</li>');
    if(index==-1) div.innerHTML='\n<div class="_layout_warnings">\n<h2>Warnings</h2>\n<ul><li>'+warning+'</ul>\n<p><a href="javascript:tsai.json_warnings_clear();">Clear warnings\n</a>\n</p>\n</div>\n';
    else div.innerHTML=innerhtml.substring(0, index+5)+'<li>'+warning+innerhtml.substring(index+5);
   });
   return true;
  }
  
  json_warnings_clear()
  {document.getElementById('json_warnings').innerHTML='';
  }
  
  /* ##########################################
     ##########  JSON READ AND LOAD  ##########
     ##########################################
     json_read (understand as read_json_file) opens .json files and handles overhead such as coregistration, slideId, and sectionId
     json_load (understand as load_json_fovs) builds fovs into tiles and is also used by append and import
  */
  json_read(file)
  {(async () =>
    {const file_text=await file.text();
     if(tsai.menus_close())
     {var warnings='';
      tsai.json.name=file.name.replace(/\.json$/, '').replace(/_?\d\d\d\d\-\d\d\-\d\d\-\d\d\d\d\d\d(_sequential|_random_together|_random_mixed)*/, '');
      var empty=JSON.parse(file_text);
      if(!('fovs' in empty) || empty.fovs.length==0) return;
      empty.fovs=[];
      tsai.json.empty=JSON.stringify(empty);
      var json=JSON.parse(file_text);
      document.getElementById('files_appended').innerHTML='';
      document.getElementById('files_appended').style.display='none';
      tsai.version('fovFormatVersion' in json?json.fovFormatVersion:tsai.mibi.version_prior);
      tsai.json.slide_id=0;
      tsai.json.section_ids=[];
      tsai.coregistration.json='';
      tsai.navigation_errors_clear();
      document.getElementById('navigation_adjustments').value='';
      document.getElementById('navigation_adjustments_output').innerHTML='';
      if(('fovs' in json) && json.fovs.length>0)
      {if(('notes' in json.fovs[0]) && json.fovs[0].notes!=null && json.fovs[0].notes.replace(/[^d]/g, '')!='' && json.fovs[0].notes.trim().replace(/[A-Za-z0-9\+=\/]/g, '')=='') // new json has possible coregistration in notes section
       {if(tsai.coregistration_set('json', tsai.optical_from_base64(json.fovs[0].notes), '')) // coregistration_set will place shift into scratch.shift
        {if(!tsai.images.sed.loaded) tsai.coregistration.shift={x_x: tsai.scratch.shift.x_x, x_y: tsai.scratch.shift.x_y, y_x: tsai.scratch.shift.y_x, y_y: tsai.scratch.shift.y_y}; // sed image shift supercedes json shift
         for(var index=0; index<2; index++) // fill shift inputs
         {for(var axis=0; axis<2; axis++) document.getElementById('sed_shift_'+['x', 'y'][index]+'_'+['x', 'y'][axis]).value=tsai.coregistration.shift[['x', 'y'][index]+'_'+['x', 'y'][axis]];
         }
         json.fovs[0].notes=null;
        }
        else
        {tsai.coregistration_load(); // if no coregistration_set, use last coregistration settings and load scratch.shift from tsai.coregistration.shift
         tsai.scratch.shift={x_x: tsai.coregistration.shift.x_x, x_y: tsai.coregistration.shift.x_y, y_x: tsai.coregistration.shift.y_x, y_y: tsai.coregistration.shift.y_y};
       }}
       var fovs=json.fovs.length;
       for(var index=0; index<fovs; index++) // must set tsai.json.slide_id before tsai.json_load()
       {var fov=json.fovs[index];
        if(!('standardTarget' in fov) || fov.standardTarget!='Molybdenum Foil') // ignore slideId and sectionId for molybdenum foil
        {if(tsai.mibi.version!=tsai.mibi.version_latest && 'focusSite' in fov) tsai.version(tsai.mibi.version_latest);
         var slide_id=Math.abs(parseInt(fov.slideId));
         if(tsai.json.slide_id==0 && !isNaN(slide_id)) tsai.json.slide_id=slide_id;
         else if(tsai.json.slide_id==0 || tsai.json.slide_id!=slide_id) warnings+='\n<li>'+fov.name+' invalid or mismatched slideId '+fov.slideId+'</li>';
         var section_id=Math.abs(parseInt(fov.sectionId));
         if(isNaN(section_id))
         {warnings+='\n<li>'+fov.name+' invalid sectionId '+fov.sectionId+'</li>';
          if(tsai.json.section_ids.length>0) fov.sectionId=tsai.json.section_ids[0];
         }
         else if(!tsai.json.section_ids.includes(section_id)) tsai.json.section_ids.push(section_id);
      }}}
      else if(tsai.images.optical.type=='json') // some prior json is loaded, but new json does not have coregistration -> do NOT use prior json coregistration or scratch.shift for current JSON
      {tsai.coregistration_load();
       tsai.scratch.shift={};
      }
      tsai.json_warnings_clear();
      if(warnings!='') tsai.json_warnings(warnings);
      if(tsai.image.loaded) tsai.image_tab(tsai.image.key, tsai.image.scale);
      tsai.tiles=tsai.json_load(JSON.stringify(json), tsai.json_warnings);
      tsai.scratch.shift={}; // clear scratch.shift so not used in import_action
      tsai.json.original=json;
      tsai.tiles_write(0);
      tsai.action_clear(true);
      tsai.json_summary(false);
      tsai.json_lists(true, true);
      tsai.tiles_builder();
      document.getElementById('tile_builder_div').style.display='';
   }}) ();
  }
  
  json_append(file)
  {(async () =>
    {const file_text=await file.text();
     if(tsai.menus_close())
     {var append=JSON.parse(file_text);
      if(!('fovs' in append) || append.fovs.length==0) return;
      tsai.json.original.fovs=tsai.json.original.fovs.concat(append.fovs);
      var append_fovs_length=append.fovs.length;
      for(var index=0; index<append_fovs_length; index++) // check tsai.json.slide_id
      {var slide_id=Math.abs(parseInt(append.fovs[index].slideId));
       if(tsai.json.slide_id==0 && !isNaN(slide_id)) tsai.json.slide_id=slide_id;
       else append.fovs[index].slideId=tsai.json.slide_id;
       var section_id=Math.abs(parseInt(append.fovs[index].sectionId));
       if(isNaN(section_id))
       {tsai.json_warnings('<li>'+append.fovs[index].name+' invalid sectionId '+append.fovs[index].sectionId+'</li>');
        if(tsai.json.section_ids.length>0) append.fovs[index].sectionId=tsai.json.section_ids[0];
       }
       else if(!tsai.json.section_ids.includes(section_id)) tsai.json.section_ids.push(section_id);
      }
      tsai.scratch.shift={x_x: tsai.coregistration.shift.x_x, x_y: tsai.coregistration.shift.x_y, y_x: tsai.coregistration.shift.y_x, y_y: tsai.coregistration.shift.y_y}
      tsai.tiles=tsai.tiles.concat(tsai.json_load(file_text, tsai.json_warnings)); // appends tiles from the new json rather than replacing them all
      tsai.scratch.shift={}; // clear scratch.shift so not used in import_action
      tsai.tiles_write(0);
      tsai.action_clear(true);
      tsai.json_summary(false);
      tsai.json_lists(true, true);
      tsai.tiles_builder();
      document.getElementById('tile_builder_div').style.display='';
   }}) ();
  }
  
  json_load(json_input, warnings) // if(main==true) coregisters and loads into tile pane
  {if(json_input.match(/\"fovs\"\s*:\s*\[/)==null) {warnings('\n<li>Invalid file, "fovs":[ not found</li>'); return [];}
   var tiles=[];
   var fovs=JSON.parse(json_input).fovs;
   var fovs_length=fovs.length;
   for(var index=0; index<fovs_length; index++)
   {var fov=JSON.parse(JSON.stringify(fovs[index])); // make a duplicate FOV for adjusting
    if(!('name' in fov)) fov.name='Tile_'+(index+1);
    var name_rows_columns=fov.name.match(/^(.*)_R(\d+)C(\d+)$/);
    if(name_rows_columns==null) tiles.push({fov: fov, map: [[1]]}); // not R#C# format
    else
    {var tile=-1;
     fov.name=name_rows_columns[1];
     var row=parseInt(name_rows_columns[2]);
     var column=parseInt(name_rows_columns[3]);
     var fov_size=('fovSizeMicrons' in fov?parseInt(fov.fovSizeMicrons):800);
     if(isNaN(fov_size)) fov_size=800;
     else if(!tsai.mibi.fovs.includes(fov_size))
     {warnings('<li>'+fov.name+' FOV size not in presets, added as '+fov_size+'</li>');
      tsai.mibi.fovs.push(fov_size);
     }
     fov.fovSizeMicrons=fov_size;
     if('x_x' in tsai.scratch.shift && typeof tsai.scratch.shift.x_x!='undefined')
     {fov.centerPointMicrons.x=Math.round(fov.centerPointMicrons.x-fov_size*(column-1+((row   -1)*tsai.scratch.shift.x_y)+((column-1)*tsai.scratch.shift.x_x)));
      fov.centerPointMicrons.y=Math.round(fov.centerPointMicrons.y+fov_size*(row   -1+((column-1)*tsai.scratch.shift.y_x)+((row   -1)*tsai.scratch.shift.y_y)));
     }
     else
     {fov.centerPointMicrons.x=Math.round(fov.centerPointMicrons.x-fov_size*(column-1));
      fov.centerPointMicrons.y=Math.round(fov.centerPointMicrons.y+fov_size*(row   -1));
     }
     var tiles_length=tiles.length;
     for(var tile_search=0; tile_search<tiles_length; tile_search++) // search tiles for tile matching all parameters
     {tile=tile_search;
      if(tsai.json_equal(fov, tiles[tile].fov)) break;
      else tile=-1;
     }
     if(tile==-1) // tile with all parameters matching not found
     {var map=[];
      for(var i=0; i<row; i++)
      {map.push([]);
       for(var j=0; j<column; j++) map[i].push(0);
      }
      map[row-1][column-1]=1;
      tiles.push({fov: fov, map: map});
     }
     else // tile with all parameters matching found
     {while(tiles[tile].map.length<row) tiles[tile].map.push([]);
      while(tiles[tile].map[row-1].length<column) tiles[tile].map[row-1].push(0);
      tiles[tile].map[row-1][column-1]=1;
   }}}
   var tiles_length=tiles.length;
   for(var tile=0; tile<tiles_length; tile++) // equalize columns across all rows
   {tiles[tile].fov.slideId=tsai.json.slide_id;
    tiles[tile].fov.frameSizePixels.width=parseInt(tiles[tile].fov.frameSizePixels.width);
    tiles[tile].fov.frameSizePixels.height=parseInt(tiles[tile].fov.frameSizePixels.height);
    tsai.json_parse_preset(tiles[tile], warnings);
    var columns=0;
    var rows=tiles[tile].map.length;
    for(var row=0; row<rows; row++)
    {if(tiles[tile].map[row].length>columns) columns=tiles[tile].map[row].length;
    }
    for(var row=0; row<rows; row++)
    {while(tiles[tile].map[row].length<columns) tiles[tile].map[row].push(0);
    }
    if('focusSite' in tiles[tile].fov && tiles[tile].fov.focusSite!='None' && (tiles[tile].map.length>1 || tiles[tile].map[0].length>1))
    {warnings('<li>'+tiles[tile].fov.name+' focus site '+tiles[tile].fov.focusSite+' disabled for multi-FOV tile</li>');
     tiles[tile].fov.focusOnly=0;
     tiles[tile].fov.focusSite='None';
    }
    tiles[tile].active=true;
    tiles[tile].original={fov: JSON.stringify(tiles[tile].fov), map: JSON.stringify(tiles[tile].map), active: true};
   }
   return tiles;
  }
  
  /* ####################################
     ##########  JSON SUMMARY  ##########
     #################################### */
  json_summary(return_minutes)
  {var tile_names={};
   var tiles_length=tsai.tiles.length;
   for(var tile=0; tile<tiles_length; tile++)
   {if(tsai.tiles[tile].active)
    {var tile_name=tsai.tiles[tile].fov.name.replace(/\s/g, '').toUpperCase();
     if(!(tile_name in tile_names)) tile_names[tile_name]=1;
     else tile_names[tile_name]++;
   }}
   var calculation='';
   var total_tiles=0;
   var total_fovs=0;
   var total_area=0;
   var total_time=0; // time in ms
   for(var tile=0; tile<tiles_length; tile++)
   {if(tsai.tiles[tile].active)
    {if('focusOnly' in tsai.tiles[tile].fov && tsai.tiles[tile].fov.focusOnly==1)
     {var calculation_tile='\n <tr>';
      if(tile_names[tsai.tiles[tile].fov.name.replace(/\s/g, '').toUpperCase()]>1) 
      {calculation_tile+='<td><span class="duplicate">'+tsai.tiles[tile].fov.name+'</span></td>';
      }
      else calculation_tile+='<td>'+tsai.tiles[tile].fov.name+'</td>';
      calculation_tile+='<td>&nbsp;</td><td colspan="7">focus '+tsai.tiles[tile].fov.focusSite+' only</td></tr>';
      calculation+=calculation_tile;
      total_time+=240;
     }
     else
     {var fovs=0;
      var calculation_tile='';
      var rows=tsai.tiles[tile].map.length;
      var columns=tsai.tiles[tile].map[0].length;
      for(var row=0; row<rows; row++)
      {for(var column=0; column<columns; column++)
       {if(tsai.tiles[tile].map[row][column]!=0) fovs++;
      }}
      var fov=tsai.tiles[tile].fov.fovSizeMicrons/1000; // in mm
      var raster=tsai.tiles[tile].fov.frameSizePixels.width;
      var dwell_time=parseFloat(tsai.tiles[tile].fov.timingDescription);
      var depth=parseInt(tsai.tiles[tile].fov.scanCount);
      calculation_tile+='\n <tr>';
      if(tile_names[tsai.tiles[tile].fov.name.replace(/\s/g, '').toUpperCase()]>1) 
      {calculation_tile+='<td><span class="duplicate">'+tsai.tiles[tile].fov.name+'</span></td>';
      }
      else calculation_tile+='<td>'+tsai.tiles[tile].fov.name+'</td>';
      if('focusSite' in tsai.tiles[tile].fov && tsai.tiles[tile].fov.focusSite!='None')
      {calculation_tile+='<td>&nbsp;</td><td colspan="7">focus '+tsai.tiles[tile].fov.focusSite+'</td></tr>'+calculation_tile;
       total_time+=240;
      }
      calculation_tile+=''
       +'<td>'+tsai.tiles[tile].fov.fovSizeMicrons+' &microm</td>'
       +'<td>'+(raster.toString().replace(/\.0*$/, ''))+' pixels<sup>2</sup></td>'
       +'<td>&times</td>'
       +'<td>'+dwell_time+' ms'+('displayName' in tsai.tiles[tile].fov.imagingPreset?' ('+tsai.tiles[tile].fov.imagingPreset.displayName+')':'')+'</td>'
       +'<td>&times</td>'
       +'<td>'+depth+' depth'+(depth>1?'s':'')+'</td>'
       +'<td>&times</td>'
       +'<td>'+fovs+' FOV'+(fovs>1?'s':'')+'</td></tr>';
      if(fovs>0)
      {calculation+=calculation_tile;
       total_area+=Math.pow(fov, 2)*fovs;
       total_time+=Math.pow(raster, 2)*dwell_time*depth*fovs;
       total_fovs+=fovs;
       total_tiles++;
   }}}}
   if(return_minutes) return Math.ceil(total_time/60000);
   if(total_time==0) return;
   var time_run=total_time/1000; // time in s
   var time_days=Math.floor(time_run/86400);
   var time_hours=Math.floor((time_run-(time_days*86400))/3600);
   var time_minutes=Math.floor((time_run-(time_days*86400)-(time_hours*3600))/60);
   var time_seconds=Math.round((time_run-(time_days*86400)-(time_hours*3600)-(time_minutes*60))/60);
   var time_start=(document.getElementById('json_time_start')?new Date(document.getElementById('json_time_start').value):new Date());
   var time_readable=(time_days>0?                            time_days   +' day'   +(time_days   >1?'s':''):'');
   time_readable+=(time_hours  >0?(time_readable!=''?', ':'')+time_hours  +' hour'  +(time_hours  >1?'s':''):'');
   time_readable+=(time_minutes>0?(time_readable!=''?', ':'')+time_minutes+' minute'+(time_minutes>1?'s':''):'');
   time_readable+=(time_seconds>0?(time_readable!=''?', ':'')+time_seconds+' second'+(time_seconds>1?'s':''):'');
   var b='<table class="estimate">'
    +calculation
    +'\n <tr><td colspan="2">&nbsp;</td><td colspan="7">= '+Math.round(time_run)+' seconds</td></tr>'
    +'\n <tr><td colspan="2">&nbsp;</td><td colspan="7">= '+(Math.round(time_run/60*100)/100)+' minutes</td></tr>'
    +'\n <tr><td colspan="2">&nbsp;</td><td colspan="7">= '+(Math.round(time_run/3600*100)/100)+' hours</td></tr>'
    +'\n <tr><td colspan="2">&nbsp;</td><td colspan="7">= '+(Math.round(time_run/86400*100)/100)+' days</td></tr>'
    +(time_run>86400?'\n <tr><td colspan="2">&nbsp;</td><td colspan="7">= '+time_readable+'</td></tr>':'')
    +'\n <tr><td colspan="9">&nbsp;</td></tr>'
    +'\n <tr><td colspan="9">'+total_tiles+' tile'+(total_tiles>1?'s':'')+', '+total_fovs+' FOV'+(total_fovs>1?'s':'')+'</td></tr>'
    +'\n <tr><td colspan="2">Estimated area  </td><td colspan="7">'+(Math.round(total_area*100)/100)+' mm<sup>2</sup></td></tr>'
    +'\n <tr><td colspan="2">Start time      </td><td colspan="7"><input id="json_time_start" type="datetime-local" value="'+tsai.time_format(time_start).json+'" onchange="tsai.json_summary(false);"/></td></tr>'
    +'\n <tr><td colspan="2">Estimated finish</td><td colspan="7"><input id="json_time_end"   type="datetime-local" value="'+tsai.time_format(new Date(time_start.getTime()+(time_run*1000))).json+'" onfocus="this.blur();" readonly/></td></tr>'
    +'\n</table>';
   document.getElementById('json_summary').innerHTML=b;
  }
  
  json_radio(id) // clicking in text box selects the corresponding radio button
  {var radios=document.getElementsByTagName(document.getElementById(id).name);
   for(var radio=0; radio<radios.length; radio++) radios[radio].checked=false;
   document.getElementById(id).checked=true;
   tsai.json_lists(true, false);
  }
  
  /* #######################################
     ##########  JSON BUILD FOVS  ##########
     ####################################### */
  json_fovs()
  {var warnings=false;
   var tiles=tsai.tiles;
   var fovs=[]; // fovs[index]={fov:fov, tile:tile_index, group:(tile_index or -1 for molybdenum foil), focus_x:x, focus_y:y, time:seconds}
   var fov_areas=[];
   var tile_names={};
   var slide_ids=[];
   var dwells=tsai.mibi.dwells;
   var dwells_length=tsai.mibi.dwells.length;
   var tiles_length=tiles.length;
   for(var tile_index=0; tile_index<tiles_length; tile_index++)
   {var tile=tiles[tile_index];
    if(tile.active)
    {// check tile name, slideId, sectionId
     if(tile.fov.name=='')
     {tile.fov.name='Tile_'+(tile_index+1);
      document.getElementById('tile_'+tile_index+'_name').value='Tile_'+(tile_index+1);
      warnings=tsai.json_warnings('\n<li>Tile '+(tile_index+1)+' no name provided, renamed to Tile_'+(tile_index+1)+'</li>') || warnings;
      tsai.json_summary(false);
     }
     var tile_name=tile.fov.name.replace(/\s/g, '').toUpperCase();
     if(!(tile_name in tile_names)) tile_names[tile_name]=tile.fov.name;
     else warnings=tsai.json_warnings('<li>Duplicate tile name (space- and case-insensitive): '+tile.fov.name+'</li>') || warnings;
     for(var dwell=0; dwell<dwells_length; dwell++)
     {if(dwells[dwell][1].toString()==tile.fov.timingChoice.toString())
      {if(dwells[dwell][0]==tile.fov.timingDescription) break;
       else warnings=tsai.json_warnings('<li>'+tile.fov.name+' possible mismatch between <span class="code">timingDescription</span> and <span class="code">timingChoice</span></li>') || warnings;
     }}
     if(!(slide_ids.includes(tile.fov.slideId))) slide_ids.push(tile.fov.slideId);
     // build fovs, check bounds and overlaps
     var molybdenum=('standardTarget' in tile.fov && tile.fov.standardTarget=='Molybdenum Foil');
     var bounds_skip=(!tsai.images.optical.loaded || !('transform' in tsai.images.optical.transform) || molybdenum); // flag for skipping bounds check
     var bounds=false; // flag for optical bounds error
     var bounds_left  =tsai.images.optical.img.width *tsai.canvas.optical_bounds.left;
     var bounds_right =tsai.images.optical.img.width *tsai.canvas.optical_bounds.right;
     var bounds_top   =tsai.images.optical.img.height*tsai.canvas.optical_bounds.top;
     var bounds_bottom=tsai.images.optical.img.height*tsai.canvas.optical_bounds.bottom;
     var fov_size=tile.fov.fovSizeMicrons;
     var fov_half=fov_size/2;
     var x=Math.round(tile.fov.centerPointMicrons.x);
     var y=Math.round(tile.fov.centerPointMicrons.y);
     var rows=tile.map.length;
     var columns=tile.map[0].length;
     var time=Math.pow(tile.fov.frameSizePixels.width, 2)*parseFloat(tile.fov.timingDescription)*parseInt(tile.fov.scanCount)/1000;
     for(var row=0; row<rows; row++)
     {for(var column=0; column<columns; column++)
      {if(tile.map[row][column]==1)
       {var index=fovs.push({fov: JSON.parse(JSON.stringify(tile.fov)), tile: tile_index, group: molybdenum?-1:tile_index, time: time, focus_x:null, focus_y:null})-1;
        var fov=fovs[index].fov;
        if('focusSite' in fov && ['FOV', 'NW', 'N', 'NE', 'W', 'E', 'SW', 'S', 'SE'].includes(fov.focusSite))
        {if(row==0 && column==0)
         {var fov_shift=fov_half+60;
          switch(fov.focusSite)
          {case 'FOV': fovs[index].focus_x=x          ; fovs[index].focus_y=y          ; break;
           case 'NW' : fovs[index].focus_x=x-fov_shift; fovs[index].focus_y=y+fov_shift; break;
           case 'N'  : fovs[index].focus_x=x          ; fovs[index].focus_y=y+fov_shift; break;
           case 'NE' : fovs[index].focus_x=x+fov_shift; fovs[index].focus_y=y+fov_shift; break;
           case 'W'  : fovs[index].focus_x=x-fov_shift; fovs[index].focus_y=y          ; break;
           case 'E'  : fovs[index].focus_x=x+fov_shift; fovs[index].focus_y=y          ; break;
           case 'SW' : fovs[index].focus_x=x-fov_shift; fovs[index].focus_y=y-fov_shift; break;
           case 'S'  : fovs[index].focus_x=x          ; fovs[index].focus_y=y-fov_shift; break;
           case 'SE' : fovs[index].focus_x=x+fov_shift; fovs[index].focus_y=y-fov_shift; break;
          }
          if(fov.focusOnly==1) fovs[index].time=240;
          else fovs[index].time+=240;
         }
         else
         {tsai.json_warnings('<li>'+tile.fov.name+' is a multi-FOV tile, focus site '+fov.focusSite+' only enabled for R1C1 (if R1C1 is present)</li>');
          fov.focusOnly=0;
          fov.focusSite='None';
        }}
        fov.name=tile.fov.name;
        if(rows>1 || columns>1) fov.name+='_R'+(row+1)+'C'+(column+1);
        var fov_x=Math.round(x+fov_size*((column*(1+tsai.coregistration.shift.x_x))+(row   *tsai.coregistration.shift.x_y)));
        var fov_y=Math.round(y-fov_size*((row   *(1+tsai.coregistration.shift.y_y))+(column*tsai.coregistration.shift.y_x)));
        fov.centerPointMicrons.x=fov_x;
        fov.centerPointMicrons.y=fov_y;
        if(!('focusOnly' in tile.fov) || tile.fov.focusOnly==0)
        {var fov_areas_length=fov_areas.length;
         for(var area=0; area<fov_areas_length; area++)
         {if(tile_index==fov_areas[area][0]) break;
          if(fov_x+fov_half<=fov_areas[area][2] || fov_x-fov_half>=fov_areas[area][4] || fov_y+fov_half<=fov_areas[area][3] || fov_y-fov_half>=fov_areas[area][5]) continue; // fov is to the left, right, top, or bottom of fov_areas[area]
          warnings=tsai.json_warnings('<li>'+fov.name+' overlaps with '+fov_areas[area][1]+'</li>') || warnings;
         }
         fov_areas.push([tile_index, fov.name, fov_x-fov_half, fov_y-fov_half, fov_x+fov_half, fov_y+fov_half]);
        }
        if(!bounds && !bounds_skip)
        {var optical=tsai.coregistration_from_micron(tsai.images.optical.transform, {x: fov_x, y: fov_y});
         if(optical.x<bounds_left || optical.y<bounds_top || optical.x>bounds_right || optical.y>bounds_bottom)
         {warnings=tsai.json_warnings('<li>'+fov.name+' may extend beyond slide area ('+(Math.round(optical.x*100)/100)+', '+(Math.round(optical.y*100)/100)+')</li>') || warnings;
          bounds=true;
   }}}}}}}
   var fovs_length=fovs.length;
   if(fovs_length==0) warnings=tsai.json_warnings('<li>No tiles or FOVs selected</li>') || warnings;
   else
   {if(slide_ids.length>1) warnings=tsai.json_warnings('<li>'+slide_ids.length+' slideIds present</li>') || warnings;
    else if(slide_ids.length==1 && slide_ids[0]==0) warnings=tsai.json_warnings('<li>slideId set as 0</li>') || warnings;
   }
   // if(warnings) document.getElementById('json').scrollIntoView();
   return fovs;
  }
  
  /* ########################################
     ##########  JSON BUILD LISTS  ##########
     ######################################## */
  json_empty()
  {if(!('fovs' in tsai.json.original) || tsai.json.original.fovs.length==0) // no fovs loaded
   {if(document.getElementById('files_append_li')) document.getElementById('files_append_li').style.display='none';
    if(document.getElementById('json_build'     )) document.getElementById('json_build').style.display='none';
    return true;
   }
   else
   {document.getElementById('json_build').style.display='';
    return false;
  }}
  
  json_resume(reset)
  {var resume=-1;
   var select=document.getElementById('json_resume_select');
   if(select)
   {resume=(select?parseInt(select.value):-1);
    if(isNaN(resume) || !(resume in tsai.json.original.fovs)) {select.selectedIndex=0; resume=-1;}
   }
   var changed=false;
   if(!reset)
   {var tiles_length=tsai.tiles.length;
    for(var tile=0; tile<tiles_length; tile++)
    {if(!tsai.tiles[tile].active
     || !('fov' in tsai.tiles[tile].original)
     || !('map' in tsai.tiles[tile].original)
     || !tsai.json_equal_strict(JSON.parse(tsai.tiles[tile].original.fov), tsai.tiles[tile].fov)
     || !tsai.array_equal(JSON.parse(tsai.tiles[tile].original.map), tsai.tiles[tile].map)
     ) {changed=true; break;}
   }}
   if(reset || (tsai.json.changed && !changed)) // reset or changed back to original
   {var options='\n<option value="-1" selected>Use tiles/FOVs above</option>';
    var fovs_length=tsai.json.original.fovs.length;
    for(var index=0; index<fovs_length; index++) options+='\n<option value="'+index+'">'+(index+1)+': &nbsp; '+('name' in tsai.json.original.fovs[index]?tsai.json.original.fovs[index].name:'FOV_'+(index+1))+'</option>';
    document.getElementById('json_resume').innerHTML=''
     +'\n<h3>Start/resume from</h3>'
     +'\n<p class="json">'
     +'\n <select id="json_resume_select" onchange="tsai.json_lists(true, false);">'
     +options
     +'\n </select>'
     +'\n</p>';
    document.getElementById('json_resume').style.display='';
    tsai.json.changed=false;
    resume=-1;
   }
   else if(!tsai.json.changed && changed) // not previously changed and now changed
   {var resume=parseInt(document.getElementById('json_resume_select').value);
    if(!isNaN(resume) && resume>0) tsai.json_warnings('<li>Resume is disabled, as tiles/FOVs have changed. To resume an interrupted run, reload the original JSON</li>');
    document.getElementById('json_resume').innerHTML='&nbsp;';
    document.getElementById('json_resume').style.display='none';
    tsai.json.changed=true;
    document.getElementById('json_group_none').click();
    resume=-1;
   }
   if(resume!=tsai.json.resume) {tsai.json.resume=resume; return true;}
   else return false;
  }
  
  json_options(resume, autofocus)
  {var autofocus_remove=document.getElementById('json_autofocus_remove').checked;
   document.getElementById('json_autofocus').style.display=(autofocus?'':'none');
   if(resume!=-1)
   {document.getElementById('json_group_none_row').style.display='';
    document.getElementById('json_group_autofocus_row').style.display='none';  // if resume, do not allow regrouping by autofocus
    if(document.getElementById('json_group_autofocus').checked) document.getElementById('json_group_none').click();
    if(!autofocus || autofocus_remove) document.getElementById('json_group_tile_row').style.display=''; // if resume, allow regrouping by tile if no autofocus
    else
    {document.getElementById('json_group_none').click();
     document.getElementById('json_group_tile_row').style.display='None';
   }}
   else
   {if(!autofocus || autofocus_remove) // if no autofocus or if autofocus removed
    {document.getElementById('json_group_none_row').style.display='';
     document.getElementById('json_group_tile_row').style.display=''; // allow grouping by tile
     document.getElementById('json_group_autofocus_row').style.display='none';
     if(document.getElementById('json_group_autofocus').checked) document.getElementById('json_group_none').click(); // remove grouping by autofocus
    }
    else // autofocus present and not removed
    {document.getElementById('json_group_none_row').style.display='none';
     document.getElementById('json_group_tile_row').style.display='none';
     document.getElementById('json_group_autofocus_row').style.display=''; // allow grouping by autofocus, not grouping fovs runs the autofocus points sequentially
     if(!document.getElementById('json_group_autofocus').checked) document.getElementById('json_group_autofocus').click(); // remove grouping by tile as autofocus will not be in correct order
  }}}
  
  json_lists(build, reset)
  {if(tsai.json_empty()) return;
   if(!tsai.json_resume(reset) // need to run json_resume regardless of build, must be first
    && !build
    && tsai.tiles.length==tsai.json.tiles.length
    && tsai.json_equal_strict(tsai.tiles, tsai.json.tiles)
   ) return; // do not rebuild if no changes
   tsai.json.list.sequential=[]; // array of {fov:reference to fov, tile:tile_index, focus_x:x, focus_y:y, time:seconds}
   tsai.json.split=[]; // array of {button, resume (true or false), build (time), suffix with fov range, fovs}
   var resume=tsai.json.resume;
   var list;
   var autofocus=false; // flag for any autofocus sites, if true disables random ordering for resume unless autofocus_remove==true
   var autofocus_remove=document.getElementById('json_autofocus_remove').checked;
   var split=tsai.json.split;
   var start;
   var prefix;
   var suffix;
   if(resume!=-1) // if resume, build list from tsai.json.original.fovs
   {// load {reference to original[fov], group, time} into tsai.json.list.sequential[], ignoring tile, focus_x, focus_y for resume
    list=tsai.json.list.sequential;
    var original=tsai.json.original.fovs;
    for(var fov=0; fov<original.length; fov++)
    {list.push({fov: original[fov], group: -1, time: Math.pow(original[fov].frameSizePixels.width, 2)*parseFloat(original[fov].timingDescription)*parseInt(original[fov].scanCount)/1000});
     if(!autofocus && 'focusSite' in original[fov] && ['FOV', 'NW', 'N', 'NE', 'W', 'E', 'SW', 'S', 'SE'].includes(original[fov].focusSite)) autofocus=true;
    }
    if(resume>0)
    {var string=(resume==1?'1':'1-'+resume);
     split.push({button: 'FOV'+(resume>1?'s':'')+' '+string+' Completed', suffix: '_'+string+'_completed', fovs: list.slice(0, resume)});
     tsai.json.list.sequential=list.slice(resume);
     list=tsai.json.list.sequential;
   }}
   else // no resume, build list from tsai.tiles using tsai.json_fovs()
   {tsai.json.list.sequential=tsai.json_fovs(); // build {fov, tile, focus_x, focus_y, time} into tsai.json.list.sequential[]
    list=tsai.json.list.sequential;
    for(var item=0; item<list.length; item++) {if(!autofocus && list[item].focus_x!==null) autofocus=true;}
   }
   tsai.json_options(resume, autofocus); // fix options based upon resume, autofocus, and autofocus_remove
   // build list.sequential and list.random
   if(resume!=-1 || !autofocus || autofocus_remove)
   {tsai.json.list.random=(document.getElementById('json_group_none').checked?tsai.json_random(tsai.copy_fovs_build(list), 0, list.length) // randomize all fovs
     :tsai.json.list.random=tsai.json_group_tile_random(list) // randomize tile order, sort by tile, randomize within tiles
    );
    start =(resume!=-1?resume:0);
    prefix=(resume!=-1?' Resume ':' ');
    suffix=(resume!=-1?'_resumed':'');
   }
   else // build split grouping by autofocus point
   {[list, tsai.json.list.random]=tsai.json_group_autofocus(list);
    start=0;
    prefix=' Autofocus ';
    suffix='_autofocus';
   }
   var b='<p><span class="optional">Optional</span> Rearranging FOVs is primarily intended for molybdenum foil FOVs. '
    +'It is otherwise not recommended when autofocus FOVs are present (focus sites within parentheses). '
    +'FOVs are colored by <span class="u">sorting group</span>, <span class="i">not</span> by tile. '
    +'Autofocus/FOV order is not error-checked here.';
   var colors=tsai.canvas.line_colors.length;
   for(var order=0; order<2; order++)
   {b+='<h4>'+['Sequential', 'Random'][order]+'</h4>\n<ul id="json_rearrange_'+(['sequential', 'random'][order])+'">';
    var list=tsai.json.list[['sequential', 'random'][order]];
    for(var item=0; item<list.length; item++)
    {var fov=list[item];
     var name=fov.fov.name.trim().replace(/_(R\d+C\d+)$/, '<br/>$1')
     if(!autofocus_remove && 'focusSite' in fov.fov && ['FOV', 'NW', 'N', 'NE', 'W', 'E', 'SW', 'S', 'SE'].includes(fov.fov.focusSite)) name+=(name.indexOf('<br/>')==-1?'<br/>':' ')+'('+fov.fov.focusSite+')';
     var group=Math.floor(fov.group);
     var color=(isNaN(group) || group<0?('standardTarget' in fov.fov && fov.fov.standardTarget=='Molybdenum Foil'?['#000', '#ddd']:['#e6e3e0', '#000']):tsai.canvas.line_colors[group%colors]);
     b+='<li draggable="true" ondragstart="tsai.json_dragstart(event);" ondragover="tsai.json_dragover(event);" ondrop="tsai.json_dragdrop(event, '+start+', \''+prefix+'\', \''+suffix+'\');" style="background-color:'+color[0]+'; color:'+color[1]+';">'
      +'<input type="hidden" value="'+item+':'+order+':'+fov.group+'"/>'+name
      +'</li>';
    }
    b+='</ul>';
   }
   document.getElementById('json_rearrange_lists').innerHTML=b+'</div>';
   document.getElementById('json_rearrange').style.display='';
   tsai.json_buttons(start, prefix, suffix);
   tsai.json.tiles=JSON.parse(JSON.stringify(tsai.tiles));
  }
  
  json_sort(a, b)
  {if(a.group<b.group) return -1;
   if(a.group>b.group) return 1;
   return 0;
  }
  
  json_random(array, first, last)
  {// assumes first<last and last<array.length
   var length=last-first;
   while(length>0)
   {var random=first+Math.floor(Math.random()*length);
    length--;
    [array[first+length], array[random]]=[array[random], array[first+length]];
   }
   return array;
  }
  
  json_group_tile_random(list)
  {var remap=[];
   for(var tile=0; tile<tsai.tiles.length; tile++) remap.push(tile);
   remap=tsai.json_random(remap, 0, remap.length); // randomize remap array
   var random=tsai.copy_fovs_build(list);
   for(var item=0; item<random.length; item++)
   {if('standardTarget' in random[item].fov && random[item].fov.standardTarget=='Molybdenum Foil') random[item].group=-1;
    else random[item].group=remap[random[item].tile]; // remap tiles to random groups
   }
   return tsai.json_random_groups(random.sort(tsai.json_sort)); // sort by groups, Array.sort is stable (preserves original order)
  }
  
  json_group_autofocus(list)
  {var autofoci=[]; // find autofocus points
   for(var item=0; item<list.length; item++)
   {if(list[item].focus_x!==null) autofoci.push({x: list[item].focus_x, y: list[item].focus_y, index: item, fovs: []});
   }
   // group by closest autofocus point
   var autofoci_length=autofoci.length;
   for(var item=0; item<list.length; item++)
   {if(list[item].focus_x!==null) continue; // skip autofocus points
    if('standardTarget' in list[item].fov && list[item].fov.standardTarget=='Molybdenum Foil') {list[item].group=-1; continue;}
    var closest=0;
    var closest_distance2;
    var fov_half=50+(list[item].fov.fovSizeMicrons/2);
    var fov_x=list[item].fov.centerPointMicrons.x;
    var fov_y=list[item].fov.centerPointMicrons.y;
    var overlap=false;
    for(var autofocus=0; autofocus<autofoci_length; autofocus++)
    {var autofocus_x=autofoci[autofocus].x;
     var autofocus_y=autofoci[autofocus].y;
     var distance2=Math.pow(autofocus_x-fov_x, 2)+Math.pow(autofocus_y-fov_y, 2);
     if(fov_x+fov_half<=autofocus_x || fov_x-fov_half>=autofocus_x || fov_y+fov_half<=autofocus_y || fov_y-fov_half>=autofocus_y) // fov is to the left, right, top, or bottom of autofocus
     {if(autofocus==0 || overlap===closest) {closest=autofocus; closest_distance2=distance2;}
      else if(distance2<closest_distance2)  {closest=autofocus; closest_distance2=distance2;}
     }
     else
     {overlap=autofocus; // overlaps with focus point
      tsai.json_warnings('<li>'+list[autofoci[overlap].index].fov.name+' autofocus '+list[autofoci[overlap].index].fov.focusSite+' overlaps with '+list[item].fov.name+'</li>');
    }}
    autofoci[closest].fovs.push(item);
    if(closest_distance2>25000000)
    {tsai.json_warnings('<li>'+list[item].fov.name+' closest autofocus point '+(Math.round(Math.sqrt(closest_distance2)/100)/10)+' mm away ('+list[autofoci[closest].index].fov.name+' '+list[autofoci[closest].index].fov.focusSite+')</li>');
    }
    if(overlap!==false && overlap<closest) // overlapping autofocus point scanned before closest autofocus point, therefore before fov
    {autofoci=autofoci.slice(0, overlap).concat(autofoci.slice(overlap+1, closest+1)).concat(autofoci.slice(overlap, overlap+1)).concat(autofoci.slice(closest+1));
   }}
   // assign fovs to groups, molybdenum foil previously assigned to group -1
   for(var autofocus=0; autofocus<autofoci_length; autofocus++)
   {list[autofoci[autofocus].index].group=autofocus;
    var group=autofocus+0.5;
    for(var fov=0; fov<autofoci[autofocus].fovs.length; fov++) list[autofoci[autofocus].fovs[fov]].group=group;
   }
   list=list.sort(tsai.json_sort); // sort by groups, Array.sort is stable (preserves original order)
   // check whether autofoci are imaged before an overlying FOV
   var reorder=false;
   autofoci=[]; // list of focus_x and focus_y
   for(var item=0; item<list.length; item++)
   {if(list[item].focus_x!==null) autofoci.push({name:list[item].fov.name+' '+list[item].fov.focusSite, x: list[item].focus_x, y: list[item].focus_y});
    else
    {var fov_half=50+(list[item].fov.fovSizeMicrons/2);
     var fov_x=list[item].fov.centerPointMicrons.x;
     var fov_y=list[item].fov.centerPointMicrons.y;
     for(var autofocus=0; autofocus<autofoci.length; autofocus++)
     {var autofocus_x=autofoci[autofocus].x;
      var autofocus_y=autofoci[autofocus].y;
      if(fov_x+fov_half>autofocus_x && fov_x-fov_half<autofocus_x && fov_y+fov_half>autofocus_y && fov_y-fov_half<autofocus_y)
      {tsai.json_warnings('<li>'+autofoci[autofocus].name+' autofocus performed before imaging overlapping FOV '+list[item].fov.name+'</li>');
       reorder=true;
   }}}}
   if(reorder) tsai.json_warnings('<li>Consider moving autofocus points to non-imaged tissue and/or using focus-only FOVs.</li>');
   return [list, tsai.json_random_groups(tsai.copy_fovs_build(list))];
  }
  
  json_random_groups(list)
  {var fovs=list.length;
   var group=list[0].group;
   var start=0;
   for(var index=1; index<=fovs; index++) // randomize within groups
   {if(index==fovs)                    list=tsai.json_random(list, start, index);
    else if(list[index].group!=group) {list=tsai.json_random(list, start, index); start=index; group=list[index].group;}
   }
   return list;
  }
  
  json_buttons(start, prefix, suffix)
  {var time=(tsai.time_format()).ymdhmsm;
   var split_fovs;
   var split_time;
   [split_fovs, split_time]=tsai.json_split();
   if(tsai.json.resume!=-1) tsai.json.split.length=1;
   else tsai.json.split=[];
   var split=tsai.json.split;
   var fovs=tsai.json.list.sequential;
   tsai.json_split_fovs( split, fovs                 , start, time, prefix+'Sequential', suffix+'_sequential', fovs.length);
   tsai.json_split_fovs( split, tsai.json.list.random, start, time, prefix+'Random'    , suffix+'_random'    , fovs.length);
   if(split_fovs!==false && split_fovs<fovs.length)
   {tsai.json_split_fovs(split, fovs                 , start, time, prefix+'Sequential', suffix+'_sequential', split_fovs);
    tsai.json_split_fovs(split, tsai.json.list.random, start, time, prefix+'Random'    , suffix+'_random'    , split_fovs);
   }
   else if(split_time!==false)
   {tsai.json_split_time(split, fovs                 , start, time, prefix+'Sequential', suffix+'_sequential', split_time);
    tsai.json_split_time(split, tsai.json.list.random, start, time, prefix+'Random'    , suffix+'_random'    , split_time);
   }
   var b='<h3>Build '+time+'</h3>\n<p class="json">';
   for(var index=0; index<split.length; index++)
   {var color=(split[index].button.includes('Random')?'red':'green');
    b+='\n'+(index==0?'':'<br/>')+'<input type="button" value="'+split[index].button+'" onclick="tsai.json_export('+index+');" class="_layout_'+color+'"/>';
   }
   document.getElementById('json_download').innerHTML=b+'</p>';
   document.getElementById('json_download').style.display='';
   document.getElementById('json_build').style.display='';
   document.getElementById('files_append_li').style.display='';
   console.log('Build '+time);
  }
  
  json_dragover(event)
  {if(event.target===tsai.json.rearrange) return;
   if(event.target.parentNode!==tsai.json.rearrange.parentNode) return;
   var from_values=tsai.json.rearrange.firstElementChild.value.split(':');
   var into_values=event.target.firstElementChild.value.split(':');
   // if(from_values[1]!=into_values[1]) return; // not the same list
   // if(from_values[2]!=into_values[2] && from_values[2]!='-1') return; // prevent moving across groups, disable move onto molybdenum foil prevents misgrouping
   var lists=tsai.json.list;
   var order=(['sequential', 'random'][parseInt(from_values[1])]);
   var list=lists[order];
   var fovs=list.length;
   var from=parseInt(from_values[0]);
   var into=parseInt(into_values[0]);
   if(tsai.json_dragbefore(tsai.json.rearrange, event.target)) // into before from
   {event.target.parentNode.insertBefore(tsai.json.rearrange, event.target);
    lists[order]=list.slice(0, into).concat(list.slice(from, from+1)).concat(list.slice(into, from)).concat(list.slice(from+1));
   }
   else
   {event.target.parentNode.insertBefore(tsai.json.rearrange, event.target.nextSibling); // from before into
    lists[order]=list.slice(0, from).concat(list.slice(from+1, into+1)).concat(list.slice(from, from+1)).concat(list.slice(into+1));
   }
   var iterator=document.getElementById('json_rearrange_'+order).firstElementChild;
   for(var index=0; index<fovs; index++)
   {var values=iterator.firstElementChild.value;
    iterator.firstElementChild.value=''+index+values.substring(values.indexOf(':'));
    if(iterator.nextElementSibling) iterator=iterator.nextElementSibling;
  }}
  
  json_dragdrop(event, start, prefix, suffix)
  {event.preventDefault();
   tsai.json.rearrange=null;
   tsai.json_buttons(start, prefix, suffix)
  }
  
  json_dragstart(event)
  {event.dataTransfer.effectAllowed='move';
   event.dataTransfer.setData('text/html', null);
   tsai.json.rearrange=event.target;
  }
  
  json_dragbefore(li0, li1)
  {if(li0.parentNode===li1.parentNode)
   {for(var current=li0.previousSibling; current && current.nodeType!==Node.DOCUMENT_NODE; current=current.previousSibling)
    {if(current===li1) return true;
   }}
   return false;
  }
  
  json_split()
  {var split=[false, false];
   if(document.getElementById('json_split_fovs').checked)
   {var number=parseInt(document.getElementById('json_split_number').value);
    if(isNaN(number) || number<5) {document.getElementById('json_split_number').value=80; alert('Split FOV number is invalid, must be ≥5.');}
    else split[0]=number;
   }
   else if(document.getElementById('json_split_time').checked)
   {var hours=parseInt(document.getElementById('json_split_hours').value);
    var minutes=parseInt(document.getElementById('json_split_minutes').value);
    var seconds=((60*(isNaN(hours)?0:hours))+(isNaN(minutes)?0:minutes))*60;
    if(isNaN(seconds) || seconds<2*60*60)
    {document.getElementById('json_split_hours').value=6;
     document.getElementById('json_split_minutes').value=0;
     alert('Split time is invalid, must be number ≥60 minutes.');
    }
    else split[1]=seconds;
   }
   return split;
  }
  
  json_split_fovs(split, list, start, time, prefix, suffix, split_fovs)
  {var fovs=list.length;
   for(var index=0; index<fovs; index+=split_fovs)
   {var range=[start+index+1, Math.min(start+index+split_fovs, start+fovs)];
    var string=range[0]+(range[0]==range[1]?'':'-'+range[1]);
    var elapsed=0;
    var end=Math.min(index+split_fovs, fovs);
    for(var fov=index; fov<end; fov++) elapsed+=list[fov].time;
    split.push({button: 'FOV'+(range[0]==range[1]?'':'s')+' '+string+prefix+', '+tsai.json_time(elapsed), suffix: '_'+time+'_'+string+suffix, fovs: list.slice(index, end)});
  }}
  
  json_split_time(split, list, start, time, prefix, suffix, split_time)
  {var elapsed=0;
   var index_jump=0;
   var fovs=list.length;
   for(var index=0; index<fovs; index++)
   {var fov_time=list[index].time;
    if(index<fovs-1 && elapsed+fov_time<split_time) elapsed+=fov_time;
    else
    {if(index_jump==index || index==fovs-1) elapsed+=fov_time;
     else index--;
     var range=[start+index_jump+1, Math.min(start+index, start+fovs)+1];
     var string=range[0]+(range[0]==range[1]?'':'-'+range[1]);
     split.push({button: 'FOV'+(range[0]==range[1]?'':'s')+' '+string+prefix+', '+tsai.json_time(elapsed), suffix: '_'+time+'_'+string+suffix, fovs: list.slice(index_jump, index+1)});
     index_jump=index+1;
     elapsed=0;
  }}}
  
  json_time(seconds)
  {var hours=Math.floor(seconds/3600);
   var minutes=Math.ceil((seconds-(hours*3600))/60);
   if(minutes==60) minutes=59;
   return (hours>0?hours+(hours==1?' hour ':' hours '):'')+minutes+(minutes==1?' minute':' minutes');
  }
  
  // split[button]={button, resume, build, suffix, fovs[{fov, tile, focus_x, focus_y, focus_site, time}]}
  json_export(button)
  {var json=JSON.parse(tsai.json.empty);
   var split=tsai.json.split[button].fovs;
   var autofocus_remove=document.getElementById('json_autofocus_remove').checked;
   for(var fov=0; fov<split.length; fov++)
   {var index=json.fovs.push(split[fov].fov)-1;
    if(autofocus_remove && ('focusOnly' in json.fovs[index] || 'focusSite' in json.fovs[index]))
    {json.fovs[index].focusOnly=0;
     json.fovs[index].focusSite='None';
   }}
   var shift='|'+tsai.coregistration.shift.x_x+','+tsai.coregistration.shift.x_y+','+tsai.coregistration.shift.y_x+','+tsai.coregistration.shift.y_y;
   if(tsai.coregistration.json!='') json.fovs[0].notes=tsai.optical_to_base64(tsai.coregistration.json+shift);
   else if(['automatic', 'manual'].includes(tsai.coregistration.last)) json.fovs[0].notes=tsai.optical_to_base64(tsai.coregistration[tsai.coregistration.last+'_coordinates']+shift);
   var url=window.URL || window.webkitURL;
   var anchor=document.createElement('a');
   anchor.href=url.createObjectURL(new Blob([JSON.stringify(json, null, '  ')], {type: 'octet/stream'}));
   anchor.download=tsai.json.name+tsai.json.split[button].suffix+'.json';
   document.body.appendChild(anchor);
   anchor.click();
   document.body.removeChild(anchor);
   json.fovs[0].notes=null;
  }
  
  
  /* ########################################
     ########################################
     ##########                    ##########
     ##########   DRAW FUNCTIONS   ##########
     ##########                    ##########
     ########################################
     ######################################## */
  
  draw_clear(context)
  {context.clearRect(0, 0, tsai.canvas.draw.width, tsai.canvas.draw.height);
  }
  
  draw_line(context, start, end, style, line_thickness)
  {context.beginPath();
   context.moveTo(start.x-tsai.image.crop, start.y);
   context.lineTo(end.x  -tsai.image.crop, end.y  );
   context.lineWidth=line_thickness;
   context.lineCap='round';
   context.strokeStyle=style;
   context.stroke();
  }
  
  draw_rect(context, start, end, color)
  {context.beginPath();
   context.rect(Math.min(start.x-tsai.image.crop, end.x-tsai.image.crop), Math.min(start.y, end.y), Math.abs(start.x-end.x), Math.abs(start.y-end.y));
   context.lineWidth=tsai.coordinates.line_thickness;
   context.lineCap='round';
   context.strokeStyle=color;
   context.stroke();
  }
  
  
  /* ##############################
     ##########  CURSOR  ##########
     ############################## */
  draw_cursor()
  {var size=tsai.canvas.cursor_size;
   var center=(size-1)/2;
   var opacity='<line opacity="'+tsai.canvas.cursor_opacity+'" x1="';
   var line='" style="stroke:'+tsai.canvas.cursor_color+'; stroke-width:'+tsai.canvas.line_thickness+';"/>'; // can adjust +/-0.5 or so here
   var svg='<svg version="1.1" id="crosshair" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" '
    +'width="'+size+'px" height="'+size+'px" '
    +'viewBox="0 0 '+size+' '+size+'" '
    +'enable-background="new 0 0 '+size+' '+size+'" xml:space="preserve">'
    +opacity+ center   +'" x2="'+ center   +'" y1="0'          +'" y2="'+(center-2)+line
    +opacity+(center+2)+'" x2="'+(size-1)  +'" y1="' +center   +'" y2="'+ center   +line
    +opacity+ center   +'" x2="'+ center   +'" y1="'+(center+2)+'" y2="'+(size-1)  +line
    +opacity+'0'       +'" x2="'+(center-2)+'" y1="' +center   +'" y2="'+ center   +line
    +'</svg>';
   var b='url(\'data:image/svg+xml,'
    +(encodeURI(svg.replaceAll('\n', '')).replaceAll('=', '%3D').replaceAll('/', '%2F').replaceAll(':', '%3A').replaceAll(';', '%3B').replaceAll(',', '%2C').replaceAll('(', '%28').replaceAll(')', '%29').replaceAll('#', '%23'))
    +'\') '+center+' '+center+', auto';
   document.querySelector(':root').style.setProperty('--crosshair', b);
   tsai.canvas.draw.style.cursor='var(--crosshair)';
   /*
   --crosshair: url('data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20id%3D%22crosshair%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20width%3D%2227px%22%20height%3D%2227px%22%20viewBox%3D%220%200%2027%2027%22%20enable-background%3D%22new%200%200%2027%2027%22%20xml%3Aspace%3D%22preserve%22%3E%3Cline%20opacity%3D%220.8%22%20x1%3D%2213%22%20x2%3D%2213%22%20y1%3D%220%22%20y2%3D%2211%22%20style%3D%22stroke%3A%23fff%3B%20stroke-width%3A3%3B%22%2F%3E%3Cline%20opacity%3D%220.8%22%20x1%3D%2215%22%20x2%3D%2227%22%20y1%3D%2213%22%20y2%3D%2213%22%20style%3D%22stroke%3A%23fff%3B%20stroke-width%3A3%3B%22%2F%3E%3Cline%20opacity%3D%220.8%22%20x1%3D%2213%22%20x2%3D%2213%22%20y1%3D%2215%22%20y2%3D%2227%22%20style%3D%22stroke%3A%23fff%3B%20stroke-width%3A3%3B%22%2F%3E%3Cline%20opacity%3D%220.8%22%20x1%3D%220%22%20x2%3D%2211%22%20y1%3D%2213%22%20y2%3D%2213%22%20style%3D%22stroke%3A%23fff%3B%20stroke-width%3A3%3B%22%2F%3E%3C%2Fsvg%3E') 13 13, auto;
   <svg version="1.1" id="crosshair" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="23px" height="23px" viewBox="0 0 23 23" enable-background="new 0 0 23 23" xml:space="preserve">
    <polygon opacity="0.5" fill="#666" points="9,1 11,0 13,1 13,9 9,9"/>
    <polygon opacity="0.5" fill="#666" points="13,9 21,9 22,11 21,13 13,13"/>
    <polygon opacity="0.5" fill="#666" points="9,13 13,13 13,21 11,22 9,21"/>
    <polygon opacity="0.5" fill="#666" points="1,9 9,9 9,13 1,13 0,11"/>
    <polygon opacity="0.8" fill="#fff" points="10,1 12,1 12,9 10,9"/>
    <polygon opacity="0.8" fill="#fff" points="13,10 21,10 21,12 13,12"/>
    <polygon opacity="0.8" fill="#fff" points="10,13 12,13 12,21 10,21"/>
    <polygon opacity="0.8" fill="#fff" points="1,10 9,10 9,12 1,12"/>
   </svg>
   */
  }
  
  draw_cursor_size()
  {var size=parseFloat(document.getElementById('slide_cursor_size').value.replace(/[^0-9\.]/g,''));
   if(isNaN(size) || size<10 || size>100) document.getElementById('slide_cursor_size').value=tsai.canvas.cursor_size;
   else
   {size=Math.round(size);
    tsai.canvas.cursor_size=size+(size%2==0?1:0); // must be odd number
    document.getElementById('slide_cursor_size').value=tsai.canvas.cursor_size;
    tsai.draw_cursor();
  }}
  
  draw_cursor_color(color)
  {if(!color.match(/\s*#[0-9A-Fa-f]{3}\s*/) && !color.match(/\s*#[0-9A-Fa-f]{6}\s*/)) document.getElementById('draw_cursor_color').value=tsai.canvas.cursor_color;
   else
   {tsai.canvas.cursor_color=color.replace(/\s/g, '');
    document.getElementById('slide_cursor_color').value=tsai.canvas.cursor_color;
    tsai.draw_cursor();
  }}
  
  draw_cursor_size_crement(increment)
  {document.getElementById('slide_cursor_size').value=tsai.canvas.cursor_size+increment;
   tsai.draw_cursor_size();
  }
  
  draw_cursor_opacity()
  {var opacity=parseFloat(document.getElementById('slide_cursor_opacity').value.replace(/[^0-9\.]/g,''));
   if(isNaN(opacity) || opacity<0.1 || opacity>1) document.getElementById('slide_cursor_opacity').value=tsai.canvas.cursor_opacity;
   else
   {opacity=Math.round(opacity*100)/100;
    tsai.canvas.cursor_opacity=opacity;
    document.getElementById('slide_cursor_opacity').value=tsai.canvas.cursor_opacity;
    tsai.draw_cursor();
  }}
  
  draw_cursor_opacity_crement(increment)
  {document.getElementById('slide_cursor_opacity').value=tsai.canvas.cursor_opacity+increment;
   tsai.draw_cursor_opacity();
  }
  
  draw_line_thickness()
  {var thickness=parseFloat(document.getElementById('slide_line_thickness').value.replace(/[^0-9\.]/g,''));
   if(isNaN(thickness)) document.getElementById('slide_line_thickness').value=tsai.canvas.line_thickness;
   else if(thickness!=tsai.canvas.line_thickness)
   {if(thickness<0.5) thickness=0.5;
    tsai.canvas.line_thickness=thickness;
    document.getElementById('slide_line_thickness').value=tsai.canvas.line_thickness;
    tsai.draw_reset();
    tsai.draw_cursor();
  }}
  
  draw_line_thickness_crement(increment)
  {document.getElementById('slide_line_thickness').value=tsai.canvas.line_thickness+increment;
   tsai.draw_line_thickness();
  }
  
  draw_zoom()
  {if(tsai.action.type=='optical') return;
   var scale=parseFloat(document.getElementById('slide_zoom').value.replace(/[^0-9\.]/g,''));
   if(isNaN(scale))
   {document.getElementById('slide_zoom').value=Math.round(tsai.image.scale*1000)/1000;
    return;
   }
   var presets=[0.0625, Math.sqrt(2)/16, 0.125, Math.sqrt(2)/8, 0.25, Math.sqrt(2)/4, 0.5, Math.sqrt(2)/2, 1, Math.sqrt(2), 2];
   if(scale<presets[0]) scale=presets[0];
   else if(scale>presets[presets.length-1]) scale=presets[presets.length-1];
   else
   {for(var preset=0; preset<presets.length; preset++)
    {if(Math.abs(scale-presets[preset])/scale<0.05) scale=presets[preset];
   }}
   if(!tsai.image.loaded)
   {document.getElementById('slide_zoom').value=Math.round(scale*1000)/1000;
    tsai.image.scale=scale;
    return;
   }
   if(scale!=tsai.image.scale)
   {tsai.image_tab(tsai.image.key, scale);
    tsai.draw_reset();
  }}
  
  draw_zoom_crement(factor)
  {if(tsai.action.type=='optical') return;
   document.getElementById('slide_zoom').value=tsai.image.scale*factor;
   tsai.draw_zoom();
  }
  
  draw_filter()
  {var ids=['brightness', 'contrast'];
   var filters=[];
   for(var filter=0; filter<2; filter++)
   {filters[filter]=Math.round(parseFloat(document.getElementById('slide_'+ids[filter]).value.replace(/[^0-9\.]/g,''))*100)/100;
    if(isNaN(filters[filter])) filters[filter]=tsai.image[ids[filter]];
    else if(filters[filter]<0.1) filters[filter]=0.1;
    else if(filters[filter]>10) filters[filter]=10;
   }
   if(!tsai.image.loaded) return;
   for(var filter=0; filter<2; filter++)
   {tsai.image[ids[filter]]=filters[filter];
    document.getElementById('slide_'+ids[filter]).value=filters[filter];
   }
   tsai.image.img.style.filter='brightness('+filters[0]+') contrast('+filters[1]+')';
  }
  
  draw_filter_crement(filter, increment)
  {if(!tsai.image.loaded) return;
   document.getElementById('slide_'+filter).value=tsai.image[filter]+increment;
   tsai.draw_filter();
  }
  
  draw_key(type, event, position)
  {if(document.activeElement==document.body || ('name' in document.activeElement && document.activeElement.name=='action_radio'))
   {switch(event.code)
    {case 'KeyI': tsai.draw_line_thickness_crement(      event.shiftKey?-0.5:0.5); break;
     case 'KeyM': tsai.draw_tma_crosshair_crement(       event.shiftKey?-0.5:0.5); break;
     case 'KeyF': tsai.draw_slide_labels_size_crement(   event.shiftKey?-0.5:0.5); break;
     case 'KeyB': tsai.draw_filter_crement('brightness', event.shiftKey?-0.1:0.1); break;
     case 'KeyC': tsai.draw_filter_crement('contrast'  , event.shiftKey?-0.1:0.1); break;
     case 'KeyZ': tsai.draw_zoom_crement(                event.shiftKey?1/Math.sqrt(2):Math.sqrt(2)); break;
     case 'KeyL': document.getElementById('slide_labels').click(); break;
     case 'KeyO': document.getElementById('slide_focus_circles').click(); break;
  }}}
  
  draw_reset()
  {switch(tsai.action.type)
   {case 'move': ;
     tsai.tiles_draw(tsai.canvas.draw_context, [tsai.action.item]);
     tsai.draw_clear(tsai.canvas.prerender_context);
     tsai.canvas.prerender_context.drawImage(tsai.canvas.draw, 0, 0);
     tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, tsai.tiles[tsai.action.item].fov.centerPointMicrons.y, false);
     return;
    case 'click'    : tsai.click_load(tsai.action.item); break;
    case 'erase'    : tsai.erase_load(tsai.action.item); break;
    case 'optical'  : tsai.optical_coordinates(tsai.action.item, 0); return;
    case 'sed'      : tsai.sed_coordinates(tsai.action.item); return;
    case 'import'   : tsai.import_coordinates(tsai.action.item[0], tsai.action.item[1]); return;
    case 'tma'      : ;
    case 'duplicate': ;
    case 'polygon'  : ;
    default:
     tsai.tiles_draw(tsai.canvas.draw_context, []);
     tsai.draw_clear(tsai.canvas.prerender_context);
     tsai.canvas.prerender_context.drawImage(tsai.canvas.draw, 0, 0);
     if(tsai.action.type=='tma' && tsai.tma.points>=4) tsai.tma_draw(true);
     return;
  }}
  
  
  /* ########################################
     ########################################
     ##########                    ##########
     ##########   TILE FUNCTIONS   ##########
     ##########                    ##########
     ########################################
     ######################################## */
  
  /*
   tile_fov_corners notes:
    // no start shift correction
     var x_start=x_row-fov_half*(1+tsai.coregistration.shift.x_x+tsai.coregistration.shift.x_y);
     var y_start=y    +fov_half*(1+tsai.coregistration.shift.y_x+tsai.coregistration.shift.y_y);
  
    // no start or corner shift correction
    for(var column=0; column<tsai.tiles[tile].map[row].length; column++)
    {action(action_options, row, column,
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_row-fov_half, y: y+fov_half}),
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_row+fov_half, y: y+fov_half}),
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_row+fov_half, y: y-fov_half}),
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_row-fov_half, y: y-fov_half})
     );
     x_row+=fov;
    }
  */
  
  tile_fov_corners(tile, x, y, action, action_options)
  {var fov=tsai.tiles[tile].fov.fovSizeMicrons;
   var fov_half=fov/2;
   var rows=tsai.tiles[tile].map.length;
   var columns=tsai.tiles[tile].map[0].length;
   for(var row=0; row<rows; row++)
   {var x_row=x;
    for(var column=0; column<columns; column++)
    {var x_start=x_row-fov_half*(1+tsai.coregistration.shift.x_x+tsai.coregistration.shift.x_y)+fov*((row   *tsai.coregistration.shift.x_y)+(column*tsai.coregistration.shift.x_x)); // start shift correction
     var y_start=y    +fov_half*(1+tsai.coregistration.shift.y_x+tsai.coregistration.shift.y_y)-fov*((column*tsai.coregistration.shift.y_x)+(row   *tsai.coregistration.shift.y_y));
     action(action_options, row, column,
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_start, y: y_start}),
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_start+fov*(1+tsai.coregistration.shift.x_x), y: y_start-fov*tsai.coregistration.shift.y_x}),
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_start+fov*(1+tsai.coregistration.shift.x_x+tsai.coregistration.shift.x_y), y: y_start-fov*(1+tsai.coregistration.shift.y_x+tsai.coregistration.shift.y_y)}),
      tsai.coregistration_from_micron(tsai.image.transform, {x: x_start+fov*tsai.coregistration.shift.x_y, y: y_start-fov*(1+tsai.coregistration.shift.y_y)})
     );
     x_row+=fov;
    }
    y-=fov;
  }}
  
  tile_draw_fov(options, row, column, tl, tr, br, bl)
  {if(tsai.tiles[options.tile].map[row][column]==0) return;
   options.context.beginPath();
   options.context.moveTo(tl.x-tsai.image.crop, tl.y);
   options.context.lineTo(tr.x-tsai.image.crop, tr.y);
   options.context.lineTo(br.x-tsai.image.crop, br.y);
   options.context.lineTo(bl.x-tsai.image.crop, bl.y);
   options.context.lineTo(tl.x-tsai.image.crop, tl.y);
   if(options.fill)
   {options.context.globalAlpha=tsai.canvas.hover_fill_opacity;
    options.context.fillStyle=options.color;
    options.context.fill();
    options.context.globalAlpha=tsai.canvas.hover_line_opacity;
   }
   options.context.lineWidth=tsai.canvas.line_thickness;
   options.context.lineCap='round';
   options.context.strokeStyle=options.color;
   options.context.stroke();
  }
  
  tile_draw_autofocus(tile, x, y, action, action_options)
  {var center=tsai.coregistration_from_micron(tsai.image.transform, {x: x, y: y});
   var x_start=x-50*(1+tsai.coregistration.shift.x_x+tsai.coregistration.shift.x_y); // start shift correction
   var y_start=y+50*(1+tsai.coregistration.shift.y_x+tsai.coregistration.shift.y_y);
   var tl=tsai.coregistration_from_micron(tsai.image.transform, {x: x_start, y: y_start});
   var br=tsai.coregistration_from_micron(tsai.image.transform, {x: x_start+100*(1+tsai.coregistration.shift.x_x+tsai.coregistration.shift.x_y), y: y_start-100*(1+tsai.coregistration.shift.y_x+tsai.coregistration.shift.y_y)});
   action_options.context.globalAlpha=tsai.canvas.hover_fill_opacity;
   action(action_options, 0, 0,
    tl,
    tsai.coregistration_from_micron(tsai.image.transform, {x: x_start+100*(1+tsai.coregistration.shift.x_x), y: y_start-100*tsai.coregistration.shift.y_x}),
    br,
    tsai.coregistration_from_micron(tsai.image.transform, {x: x_start+100*tsai.coregistration.shift.x_y, y: y_start-100*(1+tsai.coregistration.shift.y_y)})
   );
   action_options.context.globalAlpha=1;
   if(tsai.canvas.slide_focus_circles)
   {action_options.context.beginPath();
    action_options.context.arc(center.x-tsai.image.crop, center.y, Math.abs(25*(tl.x-br.x+tl.y-br.y)), 0, 2*Math.PI); // 25*(100+100) microns = 5 mm
    action_options.context.lineWidth=tsai.canvas.line_thickness;
    action_options.context.lineCap='round';
    action_options.context.strokeStyle=action_options.color;
    action_options.context.setLineDash([5,5]);
    action_options.context.stroke();
    action_options.context.setLineDash([]);
  }}
  
  tiles_draw(context, except)
  {var tiles_length=tsai.tiles.length;
   if(tiles_length==0) return;
   tsai.draw_clear(context);
   for(var tile=0; tile<tiles_length; tile++)
   {if(tsai.tiles[tile].active && !except.includes(tile)) tsai.tile_draw(context, tile, tsai.tiles[tile].fov.centerPointMicrons.x, tsai.tiles[tile].fov.centerPointMicrons.y, false);
  }}
  
  tile_draw(context, tile, x, y, fill)
  {var color=tsai.canvas.line_colors[tile%tsai.canvas.line_colors.length][0];
   var focus_site=('focusSite' in tsai.tiles[tile].fov?tsai.tiles[tile].fov.focusSite.trim():'None');
   var focus_only=('focusOnly' in tsai.tiles[tile].fov?tsai.tiles[tile].fov.focusOnly:0);
   if(focus_site!='None')
   {if(focus_only!=0) focus_site='FOV';
    var focus_shift=(tsai.tiles[tile].fov.fovSizeMicrons/2)+60;
    var focus_x=x;
    var focus_y=y;
    switch(focus_site)
    {// case 'FOV': break; // no adjustments to focus_x or focus_y
     case 'NW': focus_x-=focus_shift; focus_y+=focus_shift; break;
     case 'N' :                       focus_y+=focus_shift; break;
     case 'NE': focus_x+=focus_shift; focus_y+=focus_shift; break;
     case 'W' : focus_x-=focus_shift;                       break;
     case 'E' : focus_x+=focus_shift;                       break;
     case 'SW': focus_x-=focus_shift; focus_y-=focus_shift; break;
     case 'S' :                       focus_y-=focus_shift; break;
     case 'SE': focus_x+=focus_shift; focus_y-=focus_shift; break;
    }
    tsai.tile_draw_autofocus(tile, focus_x, focus_y, tsai.tile_draw_fov, {context: context, tile: tile, fill: true, color: color});
   }
   if(focus_only==0) tsai.tile_fov_corners(tile, x, y, tsai.tile_draw_fov, {context: context, tile: tile, fill: fill, color: color}); // calls function tsai.tile_draw_fov
   context.globalAlpha=1;
   if(tsai.canvas.slide_labels)
   {var found=false;
    var rows=tsai.tiles[tile].map.length;
    var columns=tsai.tiles[tile].map[0].length;
    for(var row=0; row<rows; row++)
    {for(var column=0; column<columns; column++)
     {if(tsai.tiles[tile].map[row][column]==1 || (focus_only!=0 && row==0 && column==0))
      {var fov=(focus_only!=0?100:tsai.tiles[tile].fov.fovSizeMicrons);
       row-=0.5;
       column-=0.5;
       var top=tsai.coregistration_from_micron(tsai.image.transform,
        {x: x+fov*((row*(  tsai.coregistration.shift.x_y))+(column*(1+tsai.coregistration.shift.x_x))),
         y: y-fov*((row*(1+tsai.coregistration.shift.y_y))+(column*(  tsai.coregistration.shift.y_x)))+(focus_site!='None' && focus_site.charAt(0)=='N'?110:0
       )});
       context.font='normal normal normal '+tsai.canvas.slide_labels_size+'px "'+tsai.canvas.slide_labels_font+'"';
       context.fillStyle=color;
       context.fillText(tsai.tiles[tile].fov.name, top.x-tsai.image.crop, top.y-(0.3*tsai.canvas.slide_labels_size));
       found=true;
       break;
     }}
     if(found) break;
  }}}
  
  draw_slide_labels()
  {var checkbox=document.getElementById('slide_labels');
   if(tsai.canvas.slide_labels==checkbox.checked) return;
   else
   {tsai.canvas.slide_labels=checkbox.checked;
    tsai.tiles_draw(tsai.canvas.draw_context, []);
  }}
  
  draw_slide_labels_size()
  {var size=parseFloat(document.getElementById('slide_labels_size').value.replace(/[^0-9\.]/g,''));
   if(isNaN(size)) document.getElementById('slide_labels_size').value=tsai.canvas.slide_labels_size;
   else if(size!=tsai.canvas.slide_labels_size)
   {if(size<5) size=5;
    tsai.canvas.slide_labels_size=size;
    document.getElementById('slide_labels_size').value=size;
    if(tsai.canvas.slide_labels) tsai.tiles_draw(tsai.canvas.draw_context, []);
  }}
  
  draw_slide_labels_size_crement(increment)
  {document.getElementById('slide_labels_size').value=tsai.canvas.slide_labels_size+increment;
   tsai.draw_slide_labels_size();
  }
  
  draw_slide_focus_circles()
  {var checkbox=document.getElementById('slide_focus_circles');
   if(tsai.canvas.slide_focus_circles==checkbox.checked) return;
   else
   {tsai.canvas.slide_focus_circles=checkbox.checked;
    tsai.tiles_draw(tsai.canvas.draw_context, []);
  }}
  
  tile_hover(tile, mouse_over)
  {tsai.json_summary(false);
   if(tsai.tiles.length==0 || !tsai.image.loaded || ['optical', 'import', 'sed'].includes(tsai.action.type)) return;
   if(tsai.action.type=='tma' && tsai.scratch.polygon.length>=4) return;
   tsai.tiles_draw(tsai.canvas.draw_context, [tile]);
   if(tsai.tiles[tile].active)
   {tsai.tile_draw(tsai.canvas.draw_context, tile, tsai.tiles[tile].fov.centerPointMicrons.x, tsai.tiles[tile].fov.centerPointMicrons.y, (tsai.action.item==tile && ['move', 'click', 'erase'].includes(tsai.action.type)) || mouse_over);
    if(mouse_over)
    {var rows=tsai.tiles[tile].map.length;
     var columns=tsai.tiles[tile].map[0].length;
     var results={found: 0, x: -1, y:-1, threshold: 50};
     for(var sum=0; sum<rows+columns-1 && results.found<=results.threshold; sum++)
     {for(var row=0; row<rows; row++)
      {if(sum-row<columns && row<=sum)
       {if(tsai.tiles[tile].map[row][sum-row]==1)
        {results.found++;
         if(results.x==-1 || (sum<=results.x+results.y && Math.abs(sum-(2*row))<Math.abs(results.x-results.y)))
         {results.x=sum-row;
          results.y=row;
     }}}}}
     if(results.found>0 && results.found<results.threshold)
     {var fov=tsai.tiles[tile].fov.fovSizeMicrons;
      var apex=tsai.coregistration_from_micron(tsai.image.transform, {x: tsai.tiles[tile].fov.centerPointMicrons.x+((results.x-0.5)*fov), y: tsai.tiles[tile].fov.centerPointMicrons.y-((results.y-0.5)*fov)});
      apex.x-=tsai.image.crop;
      tsai.canvas.draw_context.beginPath();
      tsai.canvas.draw_context.moveTo(apex.x-3, apex.y-3);
      tsai.canvas.draw_context.lineTo(apex.x-28, apex.y-10);
      tsai.canvas.draw_context.lineTo(apex.x-10, apex.y-28);
      tsai.canvas.draw_context.fillStyle=tsai.canvas.line_colors[tile%tsai.canvas.line_colors.length][0];
      tsai.canvas.draw_context.fill();
  }}}}
  
  tile_hover_click(tile)
  {if(!tsai.menus_close('labels')) return;
   if(document.getElementById('tile_'+tile+'_active') && document.getElementById('tile_'+tile+'_active').checked)
   {document.getElementById('tile_'+tile+'_move').checked=true;
    tsai.tiles[tile].active=true;
    tsai.action.item=tile;
    tsai.action.type='move';
    tsai.tile_hover(tile, true);
   }
   else
   {tsai.tiles[tile].active=false;
    tsai.tile_hover(tile, false);
  }}
  
  /* ###########################################
     ##########  TILE WRITE CONTROLS  ##########
     ########################################### */
  
  /* ##########  BUILD  ########## */
  tiles_selects(prefix, tile)
  {var tile_set=(tile>=0);
   var section_ids='<select id="'+prefix+'_section_id"'+(tile_set?' onchange="tsai.tile_section_id('+tile+');"':'')+'>';
   var section_ids_length=tsai.json.section_ids.length;
   for(var index=0; index<section_ids_length; index++)
   {section_ids+='<option value="'+tsai.json.section_ids[index]+'"'
     +((tile_set && tsai.json.section_ids[index]==tsai.tiles[tile].fov.sectionId) || (!tile_set && index==0)?' selected':'')
     +'>'+tsai.json.section_ids[index]+'</option>';
   }
   section_ids+='</select>';
   var fovs='<select id="'+prefix+'_fov"'+(tile_set?' onchange="tsai.tile_fov('+tile+');"':'')+'>';
   var fovs_length=tsai.mibi.fovs.length;
   for(var index=0; index<fovs_length; index++)
   {fovs+='<option value="'+tsai.mibi.fovs[index]+'"'
     +((tile_set && tsai.mibi.fovs[index]==tsai.tiles[tile].fov.fovSizeMicrons) || (!tile_set && tsai.mibi.fovs[index]==800)?' selected':'')
     +'>'+tsai.mibi.fovs[index]+'</option>';
   }
   fovs+='</select>';
   var rasters='<select id="'+prefix+'_raster"'+(tile_set?' onchange="tsai.tile_raster('+tile+');"':'')+'>';
   var rasters_length=tsai.mibi.rasters.length;
   for(var index=0; index<rasters_length; index++)
   {rasters+='<option value="'+tsai.mibi.rasters[index]+'"'
     +((tile_set && tsai.mibi.rasters[index]==tsai.tiles[tile].fov.frameSizePixels.width) || (!tile_set && tsai.mibi.rasters[index]==2048)?' selected':'')
     +'>'+tsai.mibi.rasters[index]+'</option>';
   }
   rasters+='</select>';
   var presets='<select id="'+prefix+'_preset"'+(tile_set?'onchange="tsai.tile_preset('+tile+');"':'')+'>';
   var keys=Object.keys(tsai.mibi.presets[tsai.mibi.version]);
   var keys_length=keys.length;
   for(var index=0; index<keys_length; index++)
   {presets+='<option value="'+keys[index]+'"'
     +((tile_set && tsai.json_equal(tsai.tiles[tile].fov.imagingPreset, tsai.mibi.presets[tsai.mibi.version][keys[index]].imagingPreset)) || (!tile_set && keys[index].substring(0, 4)=='Fine')?' selected':'')
     +'>'+keys[index]+'</option>';
   }
   presets+='</select>';
   var dwells='<select id="'+prefix+'_dwell"'+(tile_set?' onchange="tsai.tile_dwell('+tile+');"':'')+'>';
   var dwells_length=tsai.mibi.dwells.length;
   for(var index=0; index<dwells_length; index++)
   {dwells+='<option value="'+tsai.mibi.dwells[index][0]+':'+tsai.mibi.dwells[index][1]+'"'
     +((tile_set && tsai.mibi.dwells[index][0]==tsai.tiles[tile].fov.timingDescription.trim()) || (!tile_set && tsai.mibi.dwells[index][0]=='1 ms')?' selected':'')
     +'>'+tsai.mibi.dwells[index][0]+'</option>';
   }
   dwells+='</select>';
   var focus_onlys='';
   var focus_sites='';
   if(parseFloat(tsai.mibi.version)>=parseFloat(tsai.mibi.version_latest))
   {focus_onlys='<select id="'+prefix+'_focus_only"'+(tile_set?' onchange="tsai.tile_focus_only('+tile+');"':'')+'>';
    for(var index=0; index<tsai.mibi.focus_onlys.length; index++)
    {focus_onlys+='<option value="'+tsai.mibi.focus_onlys[index]+'"'
      +((tile_set && tsai.mibi.focus_onlys[index]==tsai.tiles[tile].fov.focusOnly) || (!tile_set && tsai.mibi.focus_onlys[index]==0)?' selected':'')
      +'>'+tsai.mibi.focus_onlys[index]+'</option>';
    }
    focus_onlys+='</select>';
    focus_sites='<select id="'+prefix+'_focus_site"'+(tile_set?' onchange="tsai.tile_focus_site('+tile+');"':'')+'>';
    for(var index=0; index<tsai.mibi.focus_sites.length; index++)
    {focus_sites+='<option value="'+tsai.mibi.focus_sites[index]+'"'
      +((tile_set && tsai.mibi.focus_sites[index]==tsai.tiles[tile].fov.focusSite) || (!tile_set && tsai.mibi.focus_sites[index]=='None')?' selected':'')
      +'>'+tsai.mibi.focus_sites[index]+'</option>';
    }
    focus_sites+='</select>';
   }
   return {section_ids: section_ids, fovs: fovs, rasters: rasters, presets: presets, dwells: dwells, focus_onlys: focus_onlys, focus_sites: focus_sites};
  }
  
  tiles_builder()
  {var selects=tsai.tiles_selects('tiles_build', -1);
  var b='<table id="tile_builder">\n <tr>\n  <td>Section ID</td><td>FOV (&micro;m)</td><td>Raster size</td><td>Preset</td><td>Dwell</td><td>&nbsp;</td></tr>'
   +'\n <tr>'
   +'\n  <td>'+selects.section_ids+'</td>'
   +'\n  <td>'+selects.fovs+'</td>'
   +'\n  <td>'+selects.rasters+'</td>'
   +'\n  <td>'+selects.presets+'</td>'
   +'\n  <td>'+selects.dwells+'</td>'
   +'\n  <td><input type="button" value="Build tile" onclick="tsai.tiles_build();" class="_layout_green"/></td>'
    +'\n </tr>'
    +'\n</table>';
   document.getElementById('tile_builder_div').innerHTML=b;
  }
  
  tiles_builder_slide_id()
  {var id=document.getElementById('tiles_build_slide_id').value.replace(/[^0-9]/g, '');
   document.getElementById('tiles_build_slide_id').value=(id==''?0:id);
  }
  
  tiles_build()
  {var preset=document.getElementById('tiles_build_preset').value;
   var fov   =parseInt(document.getElementById('tiles_build_fov').value);
   var raster=parseInt(document.getElementById('tiles_build_raster').value);
   var dwell =document.getElementById('tiles_build_dwell').value.split(':');
   var warnings=false;
   if(!(preset in tsai.mibi.presets[tsai.mibi.version])) {tsai.json_warnings('<li>Build tile preset not recognized</li>'     ); warnings=true;}
   if(!tsai.mibi.fovs.includes(fov))                     {tsai.json_warnings('<li>Build tile FOV size not recognized</li>'   ); warnings=true;}
   if(!tsai.mibi.rasters.includes(raster))               {tsai.json_warnings('<li>Build tile raster size not recognized</li>'); warnings=true;}
   var dwell_found=false;
   if(dwell.length==2)
   {dwell[1]=parseInt(dwell[1]);
    tsai.mibi.dwells.forEach((pair)=>{if(pair[0]==dwell[0] && pair[1]==dwell[1]) dwell_found=true;});
   }
   if(!dwell_found)                                      {tsai.json_warnings('<li>Build tile dwell time not recognized</li>' ); warnings=true;}
   if(warnings) return;
   var start=tsai.tiles.length;
   var tile=tsai.tiles.push({active: true, fov: JSON.parse(JSON.stringify(tsai.mibi.presets[tsai.mibi.version][preset])), map:[[1]], original: {}})-1;
   // tiles_builder_slide_id();
   var microns=(tsai.image.loaded?tsai.coregistration_to_micron(tsai.image.transform, {x: tsai.image.crop+30, y: 30}):{x: -fov/2, y: fov/2});
   tsai.tiles[tile].fov.name                  ='';
   tsai.tiles[tile].fov.centerPointMicrons.x  =microns.x+(fov/2);
   tsai.tiles[tile].fov.centerPointMicrons.y  =microns.y-(fov/2);
   tsai.tiles[tile].fov.fovSizeMicrons        =fov;
   tsai.tiles[tile].fov.frameSizePixels       ={width: raster, height: raster};
   tsai.tiles[tile].fov.timingDescription     =dwell[0];
   tsai.tiles[tile].fov.timingChoice          =dwell[1];
   if(dwell[0] in tsai.mibi.recommended)
   {if(!tsai.mibi.recommended[dwell[0]].includes(preset))
    {tsai.json_warnings('<li>Tile '+(tile+1)+' recommended preset'+(tsai.mibi.recommended[dwell[0]].length>1?'s for '+dwell[0]+' dwell time are ':' for '+dwell[0]+' dwell time is ')+(tsai.mibi.recommended[dwell[0]].join(', ')+'</li>'));
   }}
   tsai.tiles[tile].fov.slideId               =tsai.json.slide_id;
   // tsai.tiles[tile].fov.slideId            =document.getElementById('tiles_build_slide_id').value;
   // tsai.tiles[tile].fov.slideId            =json_parse_id(tsai.tiles[tile], 'slideId');
   tsai.tiles[tile].fov.sectionId             =parseInt(document.getElementById('tiles_build_section_id').value);
   tsai.tiles[tile].active=true;
   tsai.tiles[tile].original={fov: JSON.stringify(tsai.tiles[tile].fov), map: JSON.stringify(tsai.tiles[tile].map), active: true};
   tsai.tiles_write(start);
   tsai.tile_expand(tile);
   document.getElementById('tile_'+tile+'_name').focus();
  }
  
  /* ##########  WRITE  ########## */
  tiles_write(start)
  {// reset=true undoes/resets any previously deleted tile indexes
   if(start==0) document.getElementById('tiles').innerHTML='';
   var tiles_length=tsai.tiles.length;
   if(tiles_length==0) return;
   var b='';
   for(var tile=start; tile<tiles_length; tile++) b+=tsai.tile_div(tile);
   document.getElementById('tiles').insertAdjacentHTML('beforeend', b);
   for(var tile=start; tile<tiles_length; tile++)
   {if(document.getElementById('tile_'+tile) && document.getElementById('tile_'+tile).classList.contains('tile_expanded')) tsai.tile_map_resize(tile);
   }
   if(start==0 && tiles_length>0) tsai.tile_expand(0);
   tsai.json_summary(false);
   if(tsai.image.loaded) tsai.tiles_draw(tsai.canvas.draw_context, []);
  }
  
  tile_div(tile)
  {var style=' style="background-color:'+tsai.canvas.line_colors[tile%tsai.canvas.line_colors.length][0]+'; color:'+tsai.canvas.line_colors[tile%tsai.canvas.line_colors.length][1]+'"';
   var pixels=tsai.coregistration_from_micron(tsai.image.transform, tsai.tiles[tile].fov.centerPointMicrons);
   var selects=tsai.tiles_selects('tile_'+tile, tile);
   var buttons_expand ='<td><input type="button" value="\u2261" id="tile_'+tile+'_toggle" onclick="tsai.tile_menu('+tile+');"'+style+' class="tile_expand"/></td>';
   var buttons_columns='<td><input type="button" value="\u25c0" onclick="tsai.tile_map_unshift(' +tile+',  0    );" class="tile_move tile_left"/>'
                         +' <input type="button" value="\u2212" onclick="tsai.tile_map_crement(' +tile+',  0, -1);" class="tile_resize"/>'
                         +' <input type="button" value="+"      onclick="tsai.tile_map_crement(' +tile+',  0,  1);" class="tile_resize"/></td></tr>';
   var buttons_rows   ='<td><input type="button" value="\u25b2" onclick="tsai.tile_map_unshift(' +tile+',  1    );" class="tile_move tile_up"/>'
                         +' <input type="button" value="\u2212" onclick="tsai.tile_map_crement(' +tile+', -1,  0);" class="tile_resize"/>'
                         +' <input type="button" value="+"      onclick="tsai.tile_map_crement(' +tile+',  1,  0);" class="tile_resize"/></td></tr>';
   var buttons_nudge_x='<td><input type="button" value="\u25c0" onclick="tsai.move_nudge(event, '+tile+', -1,  0);"'+style+' class="tile_move tile_left"/>'
                         +' <input type="button" value="\u25b6" onclick="tsai.move_nudge(event, '+tile+',  1,  0);"'+style+' class="tile_move tile_right"/></td></tr>';
   var buttons_nudge_y='<td><input type="button" value="\u25bc" onclick="tsai.move_nudge(event, '+tile+',  0, -1);"'+style+' class="tile_move tile_down"/>'
                         +' <input type="button" value="\u25b2" onclick="tsai.move_nudge(event, '+tile+',  0,  1);"'+style+' class="tile_move tile_up"/></td></tr>';
   var buttons_source ='<td><input type="button" value="{ json }" onclick="alert(JSON.stringify(tsai.tiles['+tile+'][\'fov\'], null, \'\t\'));" class="tile_source"/></td></tr>'
   var b='\n<div id="tile_'+tile+'" class="tile_form tile_collapsed"'
    +' onmouseover="tsai.tile_hover('+tile+', true);"'
    +' onmouseout="tsai.tile_hover('+tile+', false);">'
    +'\n <table>'
    +'\n  <tr>'
    +'\n   <td colspan="3">'
    +'\n    <table class="tile_settings">'
    +'\n     <tr><td colspan="2"><input id="tile_'+tile+'_active" type="checkbox"'+(tsai.tiles[tile].active?' checked':'')+' onclick="tsai.tile_hover_click('+tile+')"/>'
                                                     +'<input id="tile_'+tile+'_name"       type="text" value="'+tsai.tiles[tile].fov.name     +'" onchange="tsai.tile_name('      +tile+');" onfocus="tsai.labels_build('+tile+');"/></td>'+buttons_expand
    +'\n     <tr><td>x columns                </td><td><input id="tile_'+tile+'_columns"    type="text" value="'+tsai.tiles[tile].map[0].length+'" onchange="tsai.tile_map_resize('+tile+'); tsai.tiles_draw(\'canvas_draw\', []);"/></td>'+buttons_columns
    +'\n     <tr><td>y rows                   </td><td><input id="tile_'+tile+'_rows"       type="text" value="'+tsai.tiles[tile].map.length   +'" onchange="tsai.tile_map_resize('+tile+'); tsai.tiles_draw(\'canvas_draw\', []);"/></td>'+buttons_rows
    +'\n     <tr><td>x center &micro;m        </td><td><input id="tile_'+tile+'_center_x"   type="text" value="'+(Math.round(tsai.tiles[tile].fov.centerPointMicrons.x*100)/100)+'" onchange="tsai.tile_position_set('+tile+');"/></td>'+buttons_nudge_x
    +'\n     <tr><td>y center &micro;m        </td><td><input id="tile_'+tile+'_center_y"   type="text" value="'+(Math.round(tsai.tiles[tile].fov.centerPointMicrons.y*100)/100)+'" onchange="tsai.tile_position_set('+tile+');"/></td>'+buttons_nudge_y
    +'\n     <tr><td>x center pixels          </td><td><input id="tile_'+tile+'_pixels_x"   type="text" value="'+(Math.round(pixels.x*100)/100)+'" readonly/></td></tr>'
    +'\n     <tr><td>y center pixels          </td><td><input id="tile_'+tile+'_pixels_y"   type="text" value="'+(Math.round(pixels.y*100)/100)+'" readonly/></td>'+buttons_source
    +'\n     <tr><td>FOV (&micro;m)           </td><td>'+selects.fovs        +'</td></tr>'
    +'\n     <tr><td>Raster size (pixels)     </td><td>'+selects.rasters     +'</td></tr>'
    +'\n     <tr><td>Pixel distance (&micro;m)</td><td><input id="tile_'+tile+'_length"     type="text" value="'+(Math.round(tsai.tiles[tile].fov.fovSizeMicrons*1000/tsai.tiles[tile].fov.frameSizePixels.width)/1000)+'" readonly/></select></td></tr>'
    +'\n     <tr><td>Preset                   </td><td>'+selects.presets     +'</td></tr>'
    +'\n     <tr><td>Dwell (ms)               </td><td>'+selects.dwells      +'</td></tr>'
    +'\n     <tr><td>Depth                    </td><td><input id="tile_'+tile+'_depth"      type="text" value="'+parseInt(tsai.tiles[tile].fov.scanCount)+'" onchange="tsai.tile_depth('     +tile+');"/></td></tr>'
    +(parseFloat(tsai.mibi.version)>=parseFloat(tsai.mibi.version_latest)?''
    +'\n     <tr><td>Focus only               </td><td>'+selects.focus_onlys +'</td></tr>'
    +'\n     <tr><td>Focus site               </td><td>'+selects.focus_sites +'</td></tr>'
    :'')
    +'\n     <tr><td>Section ID               </td><td>'+selects.section_ids +'</td></tr>'
    //+'\n   <tr><td>Section ID               </td><td><input id="tile_'+tile+'_section_id" type="text" value="'+parseInt(tsai.tiles[tile].fov.sectionId)+'" onchange="tsai.tile_section_id('+tile+');"/></td></tr>'
    //+'\n   <tr><td>Slide ID                 </td><td><input id="tile_'+tile+'_slide_id"   type="text" value="'+parseInt(tsai.tiles[tile].fov.slideId)  +'" onchange="tsai.tile_slide_id('  +tile+');"/></td></tr>'
    +'\n    </table>'
    +'\n   </td>'
    +'\n   <td id="tile_'+tile+'_map" colspan="2" class="tile_map"></td>'
    +'\n  </tr>'
    +'\n </table>'
    +'\n <table class="tile_draw">'
    +'\n  <tr>'
    +'\n   <td><input   name="action_radio" id="tile_'+tile+'_move"      type="radio" onclick="tsai.move_load('      +tile+');"'+(tsai.action.item==tile && tsai.action.type=='move'     ?' checked':'')+' onkeydown="return false;"/><label for="tile_'+tile+'_move"     > Move</label></td>'
    +'\n   <td><input   name="action_radio" id="tile_'+tile+'_click"     type="radio" onclick="tsai.click_load('     +tile+');"'+(tsai.action.item==tile && tsai.action.type=='click'    ?' checked':'')+                          '/><label for="tile_'+tile+'_click"    > Clicker</label>'
    +'\n    <br/><input name="action_radio" id="tile_'+tile+'_erase"     type="radio" onclick="tsai.erase_load('     +tile+');"'+(tsai.action.item==tile && tsai.action.type=='erase'    ?' checked':'')+                          '/><label for="tile_'+tile+'_erase"    > Eraser</label>'
    +'\n   </td>'
    +'\n   <td><input   name="action_radio" id="tile_'+tile+'_duplicate" type="radio" onclick="tsai.duplicate_load(' +tile+');"'+(tsai.action.item==tile && tsai.action.type=='duplicate'?' checked':'')+                          '/><label for="tile_'+tile+'_duplicate"> Duplicate</label>'
    +'\n    <br/><input name="action_radio" id="tile_'+tile+'_polygon"   type="radio" onclick="tsai.polygon_builder('+tile+');"'+(tsai.action.item==tile && tsai.action.type=='polygon'  ?' checked':'')+                          '/><label for="tile_'+tile+'_polygon"  > Polygon</label>'
    +'\n   </td>'
    +'\n   <td><input   name="action_radio" id="tile_'+tile+'_tma"       type="radio" onclick="tsai.tma_builder('    +tile+');"'+(tsai.action.item==tile && tsai.action.type=='tma'      ?' checked':'')+                          '/><label for="tile_'+tile+'_tma"      > TMA</label>'
    +'\n    <br/><input name="action_radio" id="tile_'+tile+'_copy"      type="radio" onclick="tsai.copy_menu('      +tile+');"'+(tsai.action.item==tile && tsai.action.type=='copy'     ?' checked':'')+                          '/><label for="tile_'+tile+'_copy"     > Copy to</label>'
    +'\n   </td>'
    +'\n   <td>'+('fov' in tsai.tiles[tile].original?'<span><a href="javascript:tsai.tile_reset('+tile+');">Reset</a></span>':'')
    +'\n    <span><a href="javascript:tsai.tile_delete('+tile+', true);">Delete</a></span>'
    +'\n   </td>'
    +'\n  </tr>'
    +'\n </table>'
    +'\n</div>\n';
   return b;
  }
  
  /* #################################################
     ##########  TILE INPUT FIELD CONTROLS  ##########
     #################################################
     tsai.tiles[] contains all the data used to draw tiles_draw() and write json_lists(). To change the canvas or JSON file, you take the user input, perform
     error-checking on it, then change the values in tsai.tiles[]. Then you can call tiles_draw() or json_lists(). User input should not be linked directly to
     tsai.tiles[] because everything in tsai.tiles[] is assumed to be error-checked.
  */
  tile_menu(tile)
  {var tile_classlist=document.getElementById('tile_'+tile).classList;
   if(tile_classlist.contains('tile_expanded'))
   {tile_classlist.add(   'tile_collapsed');
    tile_classlist.remove('tile_expanded');
    document.getElementById('tile_'+tile+'_toggle').value='\u2261';
   }
   else tsai.tile_expand(tile);
  }
  
  tile_expand(tile)
  {var tile_classlist=document.getElementById('tile_'+tile).classList;
   tile_classlist.add(   'tile_expanded');
   tile_classlist.remove('tile_collapsed');
   document.getElementById('tile_'+tile+'_toggle').value='\u2303';
   tsai.tile_map_resize(tile);
  }
  
  tile_name(tile)
  {tsai.tiles[tile].fov.name=(document.getElementById('tile_'+tile+'_name').value).replaceAll(' ', '_').replace(/[^A-Za-z0-9_\&\*\-\+\(\)\[\]\{\}\'\"]/g, '');
   document.getElementById('tile_'+tile+'_name').value=tsai.tiles[tile].fov.name;
   if(tsai.canvas.slide_labels) tsai.tiles_draw(tsai.canvas.draw_context, []);
   tsai.json_summary(false);
  }
  
  tile_position_set(tile)
  {// not sure if these can be float or not, parse into int later
   var x=document.getElementById('tile_'+tile+'_center_x').value.replace(/[^0-9\.\-]/g, '').replace(/(^|[^\d])\./g, '$10.').replace(/\.\d*0+$/,'');
   var y=document.getElementById('tile_'+tile+'_center_y').value.replace(/[^0-9\.\-]/g, '').replace(/(^|[^\d])\./g, '$10.').replace(/\.\d*0+$/,'');
   if(x.match(/^\-?\d+\.?\d*$/)==null)
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' x coordinate is not a number, reset to prior value</li>');
    document.getElementById('tile_'+tile+'_center_x').value=tsai.tiles[tile].fov.centerPointMicrons.x;
   }
   else
   {document.getElementById('tile_'+tile+'_center_x').value=Math.round(parseFloat(x)*100)/100;
    tsai.tiles[tile].fov.centerPointMicrons.x=parseFloat(x);
   }
   if(y.match(/^\-?\d+\.?\d*$/)==null)
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' y coordinate is not a number, reset to prior value</li>');
    document.getElementById('tile_'+tile+'_center_y').value=tsai.tiles[tile].fov.centerPointMicrons.y;
   }
   else
   {document.getElementById('tile_'+tile+'_center_y').value=Math.round(parseFloat(y)*100)/100;
    tsai.tiles[tile].fov.centerPointMicrons.y=parseFloat(y);
   }
   tsai.tile_pixels(tile);
   tsai.tiles_draw(tsai.canvas.draw_context, []);
  }
  
  tile_fov(tile)
  {var select=document.getElementById('tile_'+tile+'_fov');
   var fov=parseInt(select.value);
   if(isNaN(fov))
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' FOV size not recognized, reset to prior value</li>');
    select.value=tsai.tiles[tile].fov.fovSizeMicrons;
   }
   else
   {tsai.tiles[tile].fov.fovSizeMicrons=fov;
    document.getElementById('tile_'+tile+'_length').value=Math.round(fov*1000/tsai.tiles[tile].fov.frameSizePixels.width)/1000;
    tsai.json_summary(false);
    tsai.tiles_draw(tsai.canvas.draw_context, []);
  }}
  
  tile_raster(tile)
  {var select=document.getElementById('tile_'+tile+'_raster');
   var raster=parseInt(select.value);
   if(isNaN(raster))
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' raster size not recognized, reset to prior value</li>');
    select.value=tsai.tiles[tile].fov.frameSizePixels.width;
   }
   else
   {tsai.tiles[tile].fov.frameSizePixels.width=raster;
    tsai.tiles[tile].fov.frameSizePixels.height=raster;
    document.getElementById('tile_'+tile+'_length').value=Math.round(tsai.tiles[tile].fov.fovSizeMicrons*1000/raster)/1000;
    tsai.json_summary(false);
    tsai.tiles_draw(tsai.canvas.draw_context, []);
  }}
  
  tile_preset(tile)
  {var select=document.getElementById('tile_'+tile+'_preset');
   var preset=select.value;
   if(preset in tsai.mibi.presets[tsai.mibi.version]) tsai.tiles[tile].fov.imagingPreset=JSON.parse(JSON.stringify(tsai.mibi.presets[tsai.mibi.version][preset].imagingPreset));
   else
   {var found=false;
    var keys=Object.keys(tsai.mibi.presets[tsai.mibi.version]);
    for(var key=0; key<keys.length; key++)
    {if(tsai.json_equal(tsai.tiles[tile].fov.imagingPreset, tsai.mibi.presets[tsai.mibi.version][keys[key]].imagingPreset))
     {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' preset not recognized, resetting to prior value</li>');
      select.value=keys[key];
      preset=keys[key];
      found=true;
      break;
    }}
    if(!found)
    {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' preset not recognized</li>');
     return;
   }}
   if(preset in tsai.mibi.recommended)
   {if(!tsai.mibi.recommended[preset].includes(tsai.tiles[tile].fov.timingDescription))
    {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' recommended dwell time'+(tsai.mibi.recommended[preset].length>1?'s for '+preset+' are ':' for '+preset+' is ')+(tsai.mibi.recommended[preset].join(', ')+'</li>'));
  }}}
  
  tile_dwell(tile)
  {var select=document.getElementById('tile_'+tile+'_dwell');
   var dwell=select.value.split(':');
   if(dwell[0].trim().match(/^\d+\.?\d*\s*ms$/)==null)
   {tsai.json_warnings('<li>'+tsai.tiles[tile].fov.name+' dwell time not recognized, reset to prior value</li>');
    select.value=tsai.tiles[tile].fov.timingDescription;
   }
   else
   {tsai.tiles[tile].fov.timingDescription=dwell[0];
    tsai.tiles[tile].fov.timingChoice=parseInt(dwell[1]);
    if(dwell[0] in tsai.mibi.recommended)
    {var preset=document.getElementById('tile_'+tile+'_preset').value;
     if(!tsai.mibi.recommended[dwell[0]].includes(preset))
     {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' recommended preset'+(tsai.mibi.recommended[dwell[0]].length>1?'s for '+dwell[0]+' dwell time are ':' for '+dwell[0]+' dwell time is ')+(tsai.mibi.recommended[dwell[0]].join(', ')+'</li>'));
    }}
    tsai.json_summary(false);
  }}
  
  tile_depth(tile)
  {var depth=document.getElementById('tile_'+tile+'_depth').value.trim();
   if(depth.match(/^\d+$/)==null)
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' depth is not a positive integer, reset to prior value</li>');
    document.getElementById('tile_'+tile+'_depth').value=tsai.tiles[tile].fov.scanCount;
   }
   else
   {tsai.tiles[tile].fov.scanCount=parseInt(depth);
    tsai.json_summary(false);
  }}
  
  tile_focus_only(tile)
  {var select=document.getElementById('tile_'+tile+'_focus_only');
   var only=parseInt(select.value);
   if(tsai.mibi.focus_onlys.includes(only))
   {tsai.tiles[tile].fov.focusOnly=only;
    if(only==1)
    {document.getElementById('tile_'+tile+'_focus_site').value='FOV';
     tsai.tile_focus_site(tile);
    }
    else if(tsai.tiles[tile].fov.focusSite=='FOV')
    {tsai.tiles[tile].fov.focusSite='None';
     document.getElementById('tile_'+tile+'_focus_site').value='None';
    }
    tsai.json_summary(false);
    tsai.tiles_draw(tsai.canvas.draw_context, []);
   }
   else
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' focus only not recognized, reset to prior value</li>');
    select.value=tsai.tiles[tile].fov.focusOnly;
  }}
  
  tile_focus_site(tile)
  {var select=document.getElementById('tile_'+tile+'_focus_site');
   var focus_site=select.value;
   if(tsai.mibi.focus_sites.includes(focus_site))
   {if(focus_site=='None')
    {tsai.tiles[tile].fov.focusSite=focus_site;
     tsai.tiles[tile].fov.focusOnly=0;
     document.getElementById('tile_'+tile+'_focus_only').value=0;
    }
    else
    {if(focus_site=='FOV')
     {if(!confirm('This tile will be converted to a focus-only point which will not be imaged and FOVs other than R1C1 will be discarded. Do you wish to proceed?'))
      {select.value=tsai.tiles[tile].fov.focusSite;
       document.getElementById('tile_'+tile+'_focus_only').value=0;
       return;
      }
      tsai.tiles[tile].fov.focusSite=focus_site;
      tsai.tiles[tile].fov.focusOnly=1;
      document.getElementById('tile_'+tile+'_focus_only').value=1;
     }
     else
     {if((tsai.tiles[tile].map.length>1 || tsai.tiles[tile].map[0].length>1) // focus_site is not None or FOV
       && !confirm('Focus site '+focus_site+' is incompatible with multi-FOV tiles, thus FOVs other than R1C1 will be discarded. Do you wish to proceed?'))
      {select.value=tsai.tiles[tile].fov.focusSite;
       document.getElementById('tile_'+tile+'_focus_only').value=0;
       return;
      }
      tsai.tiles[tile].fov.focusSite=focus_site;
      tsai.tiles[tile].fov.focusOnly=0;
      document.getElementById('tile_'+tile+'_focus_only').value=0;
     }
     if(tsai.tiles[tile].map.length>1 || tsai.tiles[tile].map[0].length>1)
     {document.getElementById('tile_'+tile+'_columns').value=1;
      document.getElementById('tile_'+tile+'_rows'   ).value=1;
      tsai.tile_map_resize(tile)
    }}
    tsai.json_summary(false);
    tsai.tiles_draw(tsai.canvas.draw_context, []);
   }
   else
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' focus site not recognized, reset to prior value</li>');
    select.value=tsai.tiles[tile].fov.focusSite;
  }}
  
  tile_slide_id(tile)
  {/*
   var slide_id=document.getElementById('tile_'+tile+'_slide_id').value.trim();
   if(slide_id.match(/^\d+$/)==null)
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' slide ID is not a positive integer, reset to prior value</li>');
    document.getElementById('tile_'+tile+'_slide_id').value=tsai.tiles[tile].fov.slideId;
   }
   else
   {for(var index=0; index<tsai.tiles.length; index++)
    {slide_id=parseInt(slide_id);
     if('fov' in tsai.tiles[index] && 'slideId' in tsai.tiles[index].fov) tsai.tiles[index].fov.slideId=slide_id;
     if(document.getElementById('tile_'+index+'_slide_id')) document.getElementById('tile_'+index+'_slide_id').value=slide_id;
   }}
   */
  }
  
  tile_section_id(tile)
  {var select=document.getElementById('tile_'+tile+'_section_id');
   var section_id=parseInt(select.value);
   if(isNaN(section_id))
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' Section ID not recognized, reset to prior value</li>');
    select.value=tsai.tiles[tile].fov.sectionId;
   }
   else tsai.tiles[tile].fov.sectionId=section_id;
   /*
   var section_id=document.getElementById('tile_'+tile+'_section_id').value.trim();
   if(section_id.match(/^\d+$/)==null)
   {tsai.json_warnings('<li>'+(tsai.tiles[tile].fov.name.trim()!=''?tsai.tiles[tile].fov.name:'Tile '+(tile+1))+' section ID is not a positive integer, reset to prior value</li>');
    document.getElementById('tile_'+tile+'_section_id').value=tsai.tiles[tile].fov.sectionId;
   }
   else tsai.tiles[tile].fov.sectionId=parseInt(section_id);
   */
  }
  
  tile_reset(tile)
  {var name=(tsai.tiles[tile].fov.name.trim()!=''?' ('+tsai.tiles[tile].fov.name+')':'');
   if(!confirm('Are you sure you want to reset tile '+(tile+1)+name+'?')) return;
   tsai.tiles[tile].fov=JSON.parse(tsai.tiles[tile].original.fov);
   tsai.tiles[tile].map=JSON.parse(tsai.tiles[tile].original.map);
   document.getElementById('tile_'+tile).outerHTML=tsai.tile_div(tile, false);
   tsai.tile_map_resize(tile);
   tsai.json_summary(false);
   tsai.tiles_draw(tsai.canvas.draw_context, []);
  }
  
  tile_delete(tile, warning)
  {if(!tsai.menus_close()) return;
   var name=(tsai.tiles[tile].fov.name.trim()!=''?' ('+tsai.tiles[tile].fov.name+')':'');
   if(warning && !confirm('Are you sure you want to delete tile '+(tile+1)+name+'?')) return;
   tsai.tiles[tile].active=false;
   document.getElementById('tile_'+tile+'_active').checked=false;
   document.getElementById('tile_'+tile          ).style.display='none';
   document.getElementById('tile_'+tile+'_map'   ).innerHTML='';
   if(tile==tsai.action.item) tsai.action_clear(true);
   tsai.json_summary(false);
   tsai.tiles_draw(tsai.canvas.draw_context, []);
  }
  
  tile_pixels(tile)
  {var pixels=tsai.coregistration_from_micron(tsai.image.transform, tsai.tiles[tile].fov.centerPointMicrons);
   document.getElementById('tile_'+tile+'_pixels_x').value=Math.round(pixels.x*100)/100;
   document.getElementById('tile_'+tile+'_pixels_y').value=Math.round(pixels.y*100)/100;
  }
  
  
  /* #########################################
     ##########  TILE MAP CONTROLS  ##########
     ######################################### */
  tile_map_crement(tile, row_crement, column_crement)
  {var rows_original   =tsai.tiles[tile].map.length;
   var columns_original=tsai.tiles[tile].map[0].length;
   var rows_new        =rows_original   +row_crement;
   var columns_new     =columns_original+column_crement;
   if(rows_new   <1) rows_new   =1;
   if(columns_new<1) columns_new=1;
   if(rows_new!=rows_original || columns_new!=columns_original)
   {document.getElementById('tile_'+tile+'_rows'   ).value=rows_new;
    document.getElementById('tile_'+tile+'_columns').value=columns_new;
    tsai.tile_map_resize(tile);
    tsai.json_summary(false);
  }}
  
  tile_map_unshift(tile, axis)
  {if(axis==0)
   {for(var row=0; row<tsai.tiles[tile].map.length; row++) tsai.tiles[tile].map[row].unshift(tsai.tiles[tile].map[row][0]);
    document.getElementById('tile_'+tile+'_columns').value=tsai.tiles[tile].map[0].length;
    tsai.tiles[tile].fov.centerPointMicrons.x-=tsai.tiles[tile].fov.fovSizeMicrons*(1+tsai.coregistration.shift.x_x);
    tsai.tiles[tile].fov.centerPointMicrons.y+=tsai.tiles[tile].fov.fovSizeMicrons*tsai.coregistration.shift.y_x;
   }
   else
   {tsai.tiles[tile].map.unshift(tsai.copy_array(tsai.tiles[tile].map[0]));
    document.getElementById('tile_'+tile+'_rows').value=tsai.tiles[tile].map.length;
    tsai.tiles[tile].fov.centerPointMicrons.y+=tsai.tiles[tile].fov.fovSizeMicrons*(1+tsai.coregistration.shift.y_y);
    tsai.tiles[tile].fov.centerPointMicrons.x-=tsai.tiles[tile].fov.fovSizeMicrons*tsai.coregistration.shift.x_y;
   }
   document.getElementById('tile_'+tile+'_center_x').value=tsai.tiles[tile].fov.centerPointMicrons.x;
   document.getElementById('tile_'+tile+'_center_y').value=tsai.tiles[tile].fov.centerPointMicrons.y;
   tsai.tile_map_resize(tile);
   tsai.tile_pixels(tile);
   tsai.json_summary(false);
   tsai.draw_reset();
  }
  
  tile_map_resize(tile)
  {var columns_new=parseInt(document.getElementById('tile_'+tile+'_columns').value);
   var rows_new   =parseInt(document.getElementById('tile_'+tile+'_rows'   ).value);
   var columns_original=tsai.tiles[tile].map[0].length;
   var rows_original   =tsai.tiles[tile].map.length;
   if(isNaN(columns_new) || columns_new<1) {columns_new=columns_original; document.getElementById('tile_'+tile+'_columns').value=columns_original;}
   if(isNaN(rows_new   ) || rows_new   <1) {rows_new   =rows_original   ; document.getElementById('tile_'+tile+'_rows'   ).value=rows_original   ;}
   document.getElementById('tile_'+tile+'_columns').value=columns_new;
   document.getElementById('tile_'+tile+'_rows'   ).value=rows_new;
   var map_new=[];
   var b='\n<span class="b">Map</span>\n<table class="tile_map">';
   for(var row=0; row<rows_new; row++)
   {b+='\n <tr>';
    map_new.push([]);
    for(var column=0; column<columns_new; column++)
    {var checked=false;
     if(row<rows_original && column<columns_original) checked=(tsai.tiles[tile].map[row][column]==1);
     else if(column>=columns_original) checked=(map_new[row][columns_original-1]==1);
     else if(row>=rows_original) checked=(map_new[rows_original-1][column]==1);
     map_new[row][column]=(checked?1:0);
     b+='<td><input id="tile_'+tile+'_map_'+row+'_'+column+'" type="checkbox" onchange="tsai.tile_map_check(this, '+tile+', '+row+', '+column+');"'+(checked?' checked':'')+'/></td>';
    }
    b+='</tr>';
   }
   b+='\n</table>';
   if('focusSite' in tsai.tiles[tile].fov && tsai.tiles[tile].fov.focusSite!='None' && (map_new.length>1 || map_new[0].length>1))
   {tsai.json_warnings('<li>'+tsai.tiles[tile].fov.name+' focus site '+tsai.tiles[tile].fov.focusSite+' disabled for multi-FOV tile</li>');
    tsai.tiles[tile].fov.focusOnly=0;
    tsai.tiles[tile].fov.focusSite='None';
    document.getElementById('tile_'+tile+'_focus_only').value=0;
    document.getElementById('tile_'+tile+'_focus_site').value='None';
   }
   tsai.tiles[tile].map=map_new;
   document.getElementById('tile_'+tile+'_map').innerHTML=b;
   if(tsai.action.item!=tile) tsai.tiles_draw(tsai.canvas.draw_context, []);
   else tsai.draw_reset();
   tsai.json_summary(false);
  }
  
  tile_map_check(checkbox, tile, row, column)
  {tsai.tiles[tile].map[row][column]=(checkbox.checked?1:0);
   tsai.json_summary(false);
   if(tsai.image.loaded)
   {tsai.tiles_draw(tsai.canvas.draw_context, [tile]);
    tsai.tile_draw(tsai.canvas.draw_context, tile, tsai.tiles[tile].fov.centerPointMicrons.x, tsai.tiles[tile].fov.centerPointMicrons.y, true);
    tsai.draw_reset();
  }}
  
  
  /* ##################################################
     ##################################################
     ##########                              ##########
     ##########   COREGISTRATION FUNCTIONS   ##########
     ##########                              ##########
     ##################################################
     ################################################## */
  
  /* ###########################################
     ##########  LOAD COREGISTRATION  ##########
     ###########################################
     Coregistration cases:
      Automatic optical from cookie
      Automatic optical from console or URL link
      Manual optical from cookie
      Manual optical from console link (partial)
      Manual optical from URL link (full)
      JSON optical
      SED from URL link
      SED from image file name
      Default optical
  */
  coregistration_load()
  {var cookie=tsai.cookie_get(tsai.coregistration.cookie);
   var cookie_array=(cookie!=null && cookie.length>8?cookie.split('/'):['', '', '', '', '']);
   var cookie_time=(cookie_array.length<1?['', '', '']:cookie_array[0].split(','));
   if(cookie_time.length<3) cookie_time=['', '', ''];
   tsai.coregistration.last=(cookie_time[0]=='1'?'automatic':cookie_time[0]=='2'?'manual':'default');
   tsai.coregistration.automatic_coordinates=(cookie_array.length<2?'':cookie_array[1]);
   tsai.coregistration.automatic_time=cookie_time[1];
   tsai.coregistration.manual_coordinates=(cookie_array.length<3?'':cookie_array[2]);
   tsai.coregistration.manual_time=cookie_time[2];
   var quads=(cookie_array.length<3?[]:cookie_array[2].split('|').map(function(element) {return element.split(',').map(function(subelement) {return parseFloat(subelement);});}));
   if(quads.length==4) tsai.optical_coordinates_fill(quads); // fill optical_manual inputs
   var shift=(cookie_array.length<4?[0, 0, 0, 0]:cookie_array[3].split(',').map(function(subelement) {return parseFloat(subelement);}));
   tsai.coregistration.shift=(shift.length!=4?{x_x: 0, x_y: 0, y_x: 0, y_y: 0}:{x_x: shift[0], x_y: shift[1], y_x: shift[2], y_y: shift[3]});
   for(var index=0; index<2; index++) // fill shift inputs
   {for(var axis=0; axis<2; axis++) document.getElementById('sed_shift_'+['x', 'y'][index]+'_'+['x', 'y'][axis]).value=tsai.coregistration.shift[['x', 'y'][index]+'_'+['x', 'y'][axis]];
   }
   var crop=(cookie_array.length<5?[0, 0]:cookie_array[4].split(',').map(function(subelement) {return parseFloat(subelement);}));
   tsai.mibi.sed_crop=(crop.length!=2?{left: 0, right:0}:{left: crop[0], right: crop[1]});
   for(var side=0; side<2; side++) document.getElementById('sed_crop_'+side).value=tsai.mibi.sed_crop[['left', 'right'][side]]; // fill crop inputs
   var manual_new=[];
   // check window.location.search for ?sed= or ?automatic= or ?manual=
   var search=window.location.search.toLowerCase().replace(/[^\d]+$/, '');
   if(     search.indexOf('?automatic=')==0)
   {tsai.coregistration_set('automatic', search.substring('?automatic='.length).replaceAll('%7c', '|'), tsai.time_format().readable);
    return;
   }
   else if(search.indexOf('?manual='   )==0)
   {var manual=search.substring('?manual='.length);
    var manual_full=manual.split('|'); // manual coregistration from link
    if(manual_full.length>=4)
    {tsai.coordinates.optical=[[], [], [], []];
     for(var index=0; index<4; index++) tsai.coordinates.optical[index]=manual_full[index].split(',').map(function(element) {return parseFloat(element);});
     tsai.optical_coordinates_fill();
     if(tsai.coregistration_set('manual', manual, tsai.time_format().readable))
     {window.location=tsai.url.tsai;
      return;
    }}
    else
    {manual_new=manual.split(','); // new manual coregistration
     if(manual_new.length==8)
     {for(var index=0; index<4; index++) tsai.coordinates.optical[index]=['', '', parseFloat(manual_new[2*index]), parseFloat(manual_new[2*index+1])];
      tsai.optical_coordinates_fill();
      document.getElementById('optical_coordinates_0').checked=true;
      document.getElementById('optical_coordinates_0_0_x').focus();
      tsai.optical_coordinates(0, 0);
      tsai.element_toggle_on('optical_toggle');
      tsai.element_toggle_on('optical_manual_toggle');
   }}}
   // no (successful) coregistration from window.location.search (if successful then already returned)
   if(manual_new.length==0 && tsai.coregistration.manual_coordinates!='') tsai.optical_coordinates_fill(tsai.coregistration.manual_coordinates.split('|').map(function(element) {return element.split(',');})); // not manual coregistration -> load prior manual coregistration values
   var coregistered=true;
   if(     tsai.coregistration.last=='automatic') coregistered=tsai.coregistration_set('automatic', tsai.coregistration.automatic_coordinates, tsai.coregistration.automatic_time);
   else if(tsai.coregistration.last=='manual'   ) coregistered=tsai.coregistration_set('manual'   , tsai.coregistration.manual_coordinates   , tsai.coregistration.manual_time);
   else coregistered=false;
   if(!coregistered)
   {tsai.element_toggle_on('optical_toggle');
    tsai.coregistration_set('default', tsai.coregistration.default, '');
    if(window.location.search.indexOf('?manual=')==0) tsai.json_warnings('<li>Optical image tile positions will not be accurate until coregistration is complete</li>');
    else tsai.json_warnings('<li>Coregistration has not been performed or previously successful in this browser. Default values are loaded and optical image tile positions will not be accurate</li>');
  }}
  
  /* ##########################################
     ##########  SET COREGISTRATION  ##########
     ##########################################
     Types are automatic, manual, sed, json, and default
     input coordinates string is  optical x, y, micron x, y |  optical x, y, micron x, y |  optical x, y, micron x, y |  optical x, y, micron x, y |  shift x_x, x_y, y_x, y_y
     output coordinates array (canvas.image.coordinates) is [[micron x0, y0, x1, y1, x2, y2, x3, y3], [optical x0, y0, x1, y1, x2, y2, x3, y3]]
  */
  coregistration_set(type, coordinates, time)
  {var success=false;
   var parsed=''; // parsed coordinates for cookie
   var from_into=[[], []];
   if(type=='sed')
   {var sed=coordinates.replace(/(^|[^\d])\./g, '$10.').match(/(\d+\.?\d*),(\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*)/);
    if(sed)
    {// Coregistration is scaled to tsai.canvas.prerender.width or height because user may resize image
     sed[3]=parseFloat(sed[3])*tsai.images.sed.img.naturalWidth /parseInt(sed[1]); // x left
     sed[4]=parseFloat(sed[4])*tsai.images.sed.img.naturalHeight/parseInt(sed[2]); // y top
     sed[5]=parseFloat(sed[5])*tsai.images.sed.img.naturalWidth /parseInt(sed[1]); // x right
     sed[6]=parseFloat(sed[6])*tsai.images.sed.img.naturalHeight/parseInt(sed[2]); // y bottom
     tsai.images.sed.coordinates=[
      [parseFloat(sed[7]), parseFloat(sed[8]), parseFloat(sed[9]), parseFloat(sed[10]), parseFloat(sed[11]), parseFloat(sed[12]), parseFloat(sed[13]), parseFloat(sed[14])],
      [sed[3], sed[4], sed[5], sed[4], sed[3], sed[6], sed[5], sed[6]]];
     tsai.coregistration.shift={x_x: parseFloat(sed[15]), x_y: parseFloat(sed[16]), y_x: parseFloat(sed[17]), y_y: parseFloat(sed[18])};
     tsai.image=tsai.images.sed;
     document.getElementById('optical_link').style.display='none';
     success=true;
   }}
   else
   {if(typeof coordinates=='string')
    {var quads=coordinates.replace(/[\s\t]/g, '').replace(/(^|[^\d])\./g, '$10.').split('|'); // remove spaces, change .# to 0.#, split into quads
     var found=0;
     for(var index=0; index<quads.length; index++)
     {var quad=(quads[index]).match(/(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*),(\-?\d+\.?\d*)/);
      if(quad==null) continue;
      if(found<4)
      {from_into[0].push(parseFloat(quad[3])*1000);
       from_into[0].push(parseFloat(quad[4])*1000);
       from_into[1].push(parseFloat(quad[1]));
       from_into[1].push(parseFloat(quad[2]));
       parsed+='|'+[parseFloat(quad[1]), parseFloat(quad[2]), parseFloat(quad[3]), parseFloat(quad[4])].join(',');
       found++;
      }
      else tsai.scratch.shift={x_x: parseFloat(quad[1]), x_y: parseFloat(quad[2]), y_x: parseFloat(quad[3]), y_y: parseFloat(quad[4])};
    }} // placeholder in case type==array is useful in the future
    if(from_into[0].length==8 && from_into[1].length==8)
    {parsed=parsed.substring(1).replace(/\s/g, '');
     success=true;
     switch(type)
     {case 'automatic':
       tsai.image=tsai.images.optical;
       tsai.image.coordinates=from_into;
       tsai.image.type=type;
       tsai.coregistration.last=type;
       if(tsai.image.coordinates[1][2]==1) success=false;
       else
       {tsai.coregistration.automatic_coordinates=parsed;
        tsai.coregistration.automatic_time=time;
        tsai.coregistration_cookie_set();
        document.getElementById('optical_link').style.display='';
       }
       break;
      case 'manual':
       tsai.image=tsai.images.optical;
       tsai.image.coordinates=from_into;
       tsai.image.type=type;
       tsai.coregistration.last=type;
       tsai.coregistration.manual_time=time;
       tsai.coregistration.manual_coordinates=parsed;
       tsai.coregistration_cookie_set();
       document.getElementById('optical_link').style.display='';
       break;
      case 'json':
       tsai.images.optical.coordinates=from_into;
       tsai.images.optical.type=type;
       tsai.coregistration.json=parsed;
       document.getElementById('optical_link').style.display='none';
       break;
      // case 'sed': break; // sed is set above but outputs directly to canvas.images.sed.coordinates rather than to from_into[]
      case 'default': ; // same as default
      default:
       tsai.image=tsai.images.optical;
       tsai.image.coordinates=from_into;
       tsai.element_toggle_on('optical_toggle');
       document.getElementById('optical_link').style.display='none';
       document.getElementById('optical_time').innerHTML='No coregistration is loaded.';
       document.getElementById('optical_time').classList.remove('success');
       document.getElementById('optical_time').classList.add('_layout_warnings');
       document.getElementById('optical_time').style.display='';
       success=false;
   }}}
   var b='';
   // write coregistration information
   if(     tsai.coregistration.automatic_coordinates=='') b+='Automatic coregistration has not been completed in this browser<br/>';
   else if(tsai.image.type=='automatic'                 ) b+='Using automatic coregistration performed on '+tsai.coregistration.automatic_time+'<br/>';
   else if(tsai.coregistration.automatic_coordinates!='') b+='Automatic coregistration was last performed on '+tsai.coregistration.automatic_time+'<br/>';
   if(     tsai.coregistration.manual_coordinates==''   ) b+='Manual coregistration has not been completed in this browser';
   else if(tsai.image.type=='manual'                    ) b+='Using manual coregistration performed on '+tsai.coregistration.manual_time;
   else if(tsai.coregistration.manual_coordinates!=''   ) b+='Manual coregistration was last performed on '+tsai.coregistration.manual_time;
   if(     type=='default'                              ) b='Using default coregistration<br/>'+b;
   else if(tsai.image.type=='sed'                       ) b='Using SED coregistration<br/>'+b;
   else if(tsai.image.type=='json'                      ) b='Using JSON file coregistration<br/>'+b;
   document.getElementById('optical_time').innerHTML=b;
   document.getElementById('optical_time').classList.remove('_layout_warnings');
   document.getElementById('optical_time').classList.add('success');
   document.getElementById('optical_time').style.display='';
   if(tsai.image.loaded)
   {tsai.image_tab(tsai.image.key, tsai.image.scale);
    tsai.tiles_draw(tsai.canvas.draw_context, []);
   }
   else tsai.image.transform=tsai.matrix_perspective(tsai.image.coordinates[0], tsai.image.coordinates[1]);
   return success;
  }
  
  coregistration_cookie_set()
  {var cookie_time=[tsai.coregistration.last=='automatic'?1:tsai.coregistration.last=='manual'?2:0, tsai.coregistration.automatic_time, tsai.coregistration.manual_time];
   var shift=tsai.coregistration.shift.x_x+','+tsai.coregistration.shift.x_y+','+tsai.coregistration.shift.y_x+','+tsai.coregistration.shift.y_y;
   var crop=tsai.mibi.sed_crop.left+','+tsai.mibi.sed_crop.right;
   tsai.cookie_set(tsai.coregistration.cookie, [cookie_time.join(','), tsai.coregistration.automatic_coordinates, tsai.coregistration.manual_coordinates, shift, crop].join('/'));
  }
  
  coregistration_link()
  {if(!['automatic', 'manual'].includes(tsai.coregistration.last)) navigator.clipboard.writeText(tsai.url.tsai);
   else navigator.clipboard.writeText(tsai.url.tsai+'?'+tsai.coregistration.last+'='+tsai.coregistration[tsai.coregistration.last+'_coordinates']+'+');
  }
  
  /* ################################################
     ##########  COREGISTRATION TRANSFORM  ##########
     ################################################ */
  coregistration_from_micron(transform, coordinate) {return tsai.matrix_perspective_transform(transform, coordinate);}
  coregistration_to_micron(  transform, coordinate) {return tsai.matrix_perspective_reverse(  transform, coordinate);}
  
  /* ################################
     ##########  ENCODING  ##########
     ################################ */
  optical_to_base64(coordinates)
  {var hex=(coordinates+'|').replace(/[^0-9\-\.\,\|]/g, '').replaceAll('-', 'a').replaceAll('.', 'b').replaceAll(',', 'c').replaceAll('|', 'd');
   var encoded='';
   for(var index=0; index<hex.length; index+=2) encoded+=String.fromCharCode(parseInt(hex.substr(index, 2), 16));
   return btoa(encoded).replaceAll('=', '');
  }
  
  optical_from_base64(coordinates)
  {var encoded=atob(coordinates);
   var hex='';
   for(var index=0; index<encoded.length; index++)
   {var code=Number(encoded.charCodeAt(index)).toString(16);
    while(code.length<2) code='0'+code;
    hex+=code;
   }
   return hex.replace(/|$/, '').replaceAll('a', '-').replaceAll('b', '.').replaceAll('c', ',').replaceAll('e', ',').replaceAll('d', '|\n'); // e to , needed for backwards compatibiilty
  }
  
  /* #########################################
     ##########  OPTICAL AUTOMATIC  ##########
     ######################################### */
  optical_automatic_code()
  {var b=tsai.navigation_code_clear()
  +' if(document.getElementById(\'targetPosX\'))'
  +' {logger.level=4;'
   +' var map={multiplier: 0, info: console.info, log: [], canvas: document.getElementsByTagName(\'canvas\')[1], rect: {}, optical: {}, quad: {}, result: \'\'};'
   +' console.info=function() {map.log.push(Array.from(arguments));};'
   +' map.rect=map.canvas.getBoundingClientRect();'
   +' map.click=function(x, y) {map.canvas.dispatchEvent(new MouseEvent(\'click\', {clientX: x, clientY: y, bubbles: true}));};'
   +' map.click(map.rect.left, map.rect.top);'
   +' map.click(map.rect.right, map.rect.bottom);'
   +' map.optical={x: map.log[0][1].x*map.rect.width/(map.log[1][1].x-map.log[0][1].x), y: map.log[0][1].y*map.rect.height/(map.log[1][1].y-map.log[0][1].y)};'
   +' map.canvas.onclick=function() {setTimeout(()=>{map.result+=map.log[map.log.length-1][1].x+\',\'+map.log[map.log.length-1][1].y+\',\'+document.getElementById(\'inputOptTPX\').value.trim()+\',\'+document.getElementById(\'inputOptTPY\').value.trim()+\'|\\n\';},500);};'
   +' map.quad='
    +'{left: '  +'map.rect.left'  +'-map.optical.x-map.multiplier*map.rect.width,'
    +' top: '   +'map.rect.top'   +'-map.optical.y-map.multiplier*map.rect.height,'
    +' right: ' +'map.rect.right' +'-map.optical.x+map.multiplier*map.rect.width,'
    +' bottom: '+'map.rect.bottom'+'-map.optical.y+map.multiplier*map.rect.height};'
   +' setTimeout(()=>{console.clear(); console.log(\'\\n\\nMIBI Coregistration Tool\\nCopyright Albert G Tsai, MD, PhD\\n\\nPlease wait 8 seconds\\n\'); map.result=\'\';}, 1000);'
   +' setTimeout(()=>{map.click(map.quad.left, map.quad.top);}, 2000);'
   +' setTimeout(()=>{map.click(map.quad.right, map.quad.top);}, 3000);'
   +' setTimeout(()=>{map.click(map.quad.left, map.quad.bottom);}, 4000);'
   +' setTimeout(()=>{map.click(map.quad.right, map.quad.bottom);}, 5000);'
   +' setTimeout(()=>{console.info=map.info; map.canvas.onclick=null; logger.level=2;'
   + ' console.log(\'\\nTiler link:\\n'+tsai.url.tsai+'?automatic=\'+map.result.replace(/\\s*/g, \'\')+\'\\n\\n\\n\'); map=null;}, 6000);' // need character at end of link due to truncation
   +'}'
  +' else'
  +' {var map={canvas: document.getElementsByTagName(\'canvas\')[1], rect: {}, result: \'\'};'
   +' map.rect=map.canvas.getBoundingClientRect();'
   +' map.click=function(a, b, x, y)'
   +' {map.canvas.dispatchEvent(new MouseEvent(\'click\', {clientX: x, clientY: y, bubbles: true}));'
   + ' setTimeout(()=>{map.result+=a+\',\'+b+\',\'+document.getElementById(\'inputOptTPX\').value.trim()+\',\'+document.getElementById(\'inputOptTPY\').value.trim()+\'|\';},500);'
   + '};'
   +' setTimeout(()=>{console.clear(); console.log(\'\\n\\nMIBI Coregistration Tool\\nCopyright Albert G Tsai, MD, PhD\\n\\nPlease wait 8 seconds\\n\'); map.result=\'\';}, 1000);'
   +' setTimeout(()=>{map.click(0, 0, map.rect.left, map.rect.top);}, 2000);'
   +' setTimeout(()=>{map.click(1, 0, map.rect.right, map.rect.top);}, 3000);'
   +' setTimeout(()=>{map.click(0, 1, map.rect.left, map.rect.bottom);}, 4000);'
   +' setTimeout(()=>{map.click(1, 1, map.rect.right, map.rect.bottom);}, 5000);'
   +' setTimeout(()=>{console.log(\'\\nTiler link:\\n'+tsai.url.tsai+'?automatic=\'+map.result.replace(/\\s*/g, \'\')+\'\\n\\nCoregistration will not be complete until the optical image is loaded into MIBI TSAI.\\n\\n\\n\'); map=null;}, 6000);' // need character at end of link due to truncation
   +'}';
   navigator.clipboard.writeText(b);
  }
  
  /* ######################################
     ##########  OPTICAL MANUAL  ##########
     ###################################### */
  optical_coordinates_fill(quads)
  {if(quads!=undefined) tsai.coordinates.optical=quads;
   for(var index=0; index<4; index++)
   {for(var system=0; system<2; system++)
    {for(var axis=0; axis<2; axis++) document.getElementById('optical_coordinates_'+index+'_'+system+'_'+['x', 'y'][axis]).value=tsai.coordinates.optical[index][2*system+axis];
  }}}
  
  optical_manual_code()
  {var b=tsai.navigation_code_clear()
   +' if(typeof map===\'undefined\' || map===null)'
   +' {var map='
    + '{coordinates:[\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\'],'
    + ' description: [\'Top left\', \'Top right\', \'Bottom left\', \'Bottom right\'],'
    + ' set:'
    +  ' function(index)'
    +  ' {this.coordinates[index]=parseFloat(document.getElementById(\'currentPosX\').value);'
    +   ' this.coordinates[index+1]=parseFloat(document.getElementById(\'currentPosY\').value);'
    +   ' console.log(this.description[index/2]+\' set to (\'+this.coordinates[index]+\', \'+this.coordinates[index+1]+\')\');'
    +   '},'
    + ' jog:'
    +  ' function()'
    +  ' {if(document.getElementById(\'jogStagePopup\').hidden) document.getElementById(\'jogStageBtn\').click();'
    +   ' document.getElementById(\'jogStagePopup\').style.top=\'738px\';'
    +   ' document.getElementById(\'jogStagePopup\').style.left=\'448px\';'
    +   ' document.getElementById(\'inputJogIncrement\').value=5;'
    +   ' document.getElementById(\'inputJogIncrement\').dispatchEvent(new Event(\'input\'));'
    +   ' document.getElementsByClassName(\'crosshair\')[0].children[0].checked=true;'
    +   ' document.getElementsByClassName(\'crosshair\')[0].children[0].dispatchEvent(new Event(\'change\'));'
    +   '},'
    + ' key:'
    +  ' function(event)'
    +  ' {if(document.activeElement!=document.body) return;'
    +   ' switch(event.code)'
    +   ' {'+tsai.navigation_code_arrows()
    +    ' case \'KeyK\': this.commands(); break;'
    +    ' case \'Digit1\': this.set(0); break;'
    +    ' case \'Digit2\': this.set(2); break;'
    +    ' case \'Digit3\': this.set(4); break;'
    +    ' case \'Digit4\': this.set(6); break;'
    +    ' case \'Escape\': this.exit(); break;'
    +    '}'
    +   ' event.preventDefault();'
    +   ' return \'\';'
    +   '},'
    + ' commands:'
    +  ' function()'
    +  ' {console.log(\'\\n'
    +    '\\nMIBI Manual Coregistration Tool'
    +    '\\nCopyright Albert G Tsai, MD, PhD'
    +    '\\n'
    +    '\\nControls:'
    +    '\\n1  : Set top left fiducial'
    +    '\\n2  : Set top right fiducial'
    +    '\\n3  : Set bottom left fiducial'
    +    '\\n4  : Set bottom right fiducial'
    +    '\\nEsc: Create link and exit (unbind keys)'
    +    '\\n'
    +    '\\nK  : (K)eyboard command list'
    +    '\\nUp    / Shift+ / Alt (Option)+: Jog up    2 / 3 / 1'
    +    '\\nDown  / Shift+ / Alt (Option)+: Jog down  2 / 3 / 1'
    +    '\\nLeft  / Shift+ / Alt (Option)+: Jog left  2 / 3 / 1'
    +    '\\nRight / Shift+ / Alt (Option)+: Jog right 2 / 3 / 1\\n\\n\');'
    +   '},'
    + ' instructions:'
    +  ' function()'
    +  ' {var instructions=\'Click on a blank area of the page (not a text box or image) to use the above controls.\';'
    +   ' for(var index=0; index<4; index++) instructions+=\'\\nCenter the SED over the \'+this.description[index].toLowerCase()+\' fiducial and type \'+(index+1)+\'.\';'
    +   ' console.log(instructions+\'\\nWhen finished, press Escape.\\n\\n\');'
    +   '},'
    + ' exit:'
    +  ' function()'
    +  ' {var errors=\'\';'
    +   ' for(var index=0; index<4; index++)'
    +   ' {if(this.coordinates[index*2]==\'\') errors+=this.description[index]+\' not set.\\n\';'
    +    '}'
    +   ' if(errors!=\'\' && !confirm(errors+\'Click OK to exit anyway. Click cancel to continue setting fiducial coordinates.\')) return \'\';'
    +   ' console.log(\'\\nTiler link:\\n'+tsai.url.tsai+'?manual=\'+this.coordinates.join(\',\')+\'+\'' // need character at end of link due to truncation
    +   ' +\'\\n\\n\\n\');'
    +   ' document.removeEventListener(\'keydown\', map_key, false);'
    +   ' map=null;'
    +   ' console.log(\'Exited\\nMIBI Manual Coregistration Tool\\nCopyright Albert G Tsai, MD, PhD\\n\\n\');'
    +   ' return \'\';'
    +   '}'
    +'};}'
   +' if(typeof map_key===\'undefined\') {map_key=function(event) {map.key(event);}}'
   +' document.addEventListener(\'keydown\', map_key, false);'
   +' map.jog();'
   +' console.clear();'
   +' map.commands();'
   +' map.instructions();';
   navigator.clipboard.writeText(b);
  }
  
  optical_coordinates_draw()
  {tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.globalAlpha=tsai.coordinates.line_opacity;
   for(var index=0; index<4; index++)
   {var x=parseFloat(tsai.coordinates.optical[index][0]);
    var y=parseFloat(tsai.coordinates.optical[index][1]);
    if(isNaN(x) || isNaN(y)) continue;
    tsai.draw_line(tsai.canvas.draw_context, {x: x-tsai.coordinates.crosshair, y: y}, {x: x+tsai.coordinates.crosshair, y: y}, tsai.coordinates.line_colors[index][0], tsai.coordinates.line_thickness);
    tsai.draw_line(tsai.canvas.draw_context, {x: x, y: y-tsai.coordinates.crosshair}, {x: x, y: y+tsai.coordinates.crosshair}, tsai.coordinates.line_colors[index][0], tsai.coordinates.line_thickness);
   }
   tsai.canvas.draw_context.globalAlpha=1;
  }
  
  optical_coordinates(selected, optical_micron) // sets up optical_action
  {for(var axis=0; axis<2; axis++) // store inputs to tsai.coordinates.optical
   {var value=parseFloat(document.getElementById('optical_coordinates_'+selected+'_'+optical_micron+'_'+['x', 'y'][axis]).value);
    if(!isNaN(value)) tsai.coordinates.optical[selected][2*optical_micron+axis]=value;
   }
   if(!tsai.menus_close()) return false;
   document.getElementById('optical_coordinates_'+selected).checked=true;
   tsai.action.type='optical';
   tsai.action.item=selected; // determines which point to move
   if(tsai.images.optical.loaded)
   {tsai.image_tab('optical', 1);
    tsai.optical_coordinates_draw();
  }}
  
  /* ##########  ACTION  ########## */
  optical_action(type, event, position)
  {if(!tsai.images.optical.loaded || !tsai.menus_close()) return;
   switch(type)
   {case 'mousemove': if(!tsai.action.mouse_dragged) break; // NO forced break; only continue to draw if mousedown and dragged
    case 'mouseup':
     tsai.coordinates.optical[tsai.action.item][0]=position.x;
     tsai.coordinates.optical[tsai.action.item][1]=position.y;
     document.getElementById('optical_coordinates_'+tsai.action.item+'_0_x').value=position.x;
     document.getElementById('optical_coordinates_'+tsai.action.item+'_0_y').value=position.y;
     tsai.draw_clear(tsai.canvas.draw_context);
     tsai.optical_coordinates_draw();
     if(type!='mousemove') tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
    case 'mouseover': tsai.canvas.draw.style.cursor='var(--crosshair)'; break;
    case 'mousedown': tsai.canvas.draw.style.cursor='none'; break;
    case 'keydown':
     if(document.activeElement.id.indexOf('optical_coordinates_')!=0 && document.activeElement!=document.body) return;
     if(document.activeElement.tagName.toLowerCase()=='input' && document.activeElement.type.toLowerCase()=='text') return;
     switch(event.code)
     {case 'KeyA':
       if(tsai.action.item>0)
       {tsai.action.item--;
        document.getElementById('optical_coordinates_'+tsai.action.item).checked=true;
        event.stopPropagation();
        event.preventDefault();
       }
       break;
      case 'KeyD':
       if(tsai.action.item<3)
       {tsai.action.item++;
        document.getElementById('optical_coordinates_'+tsai.action.item).checked=true;
        event.stopPropagation();
        event.preventDefault();
       }
       break;
      case 'ArrowUp': ; // NO break
      case 'ArrowDown':
       if(typeof tsai.coordinates.optical[tsai.action.item][1]=='string' || isNaN(tsai.coordinates.optical[tsai.action.item][1])) break;
       var nudge=parseFloat(tsai.coordinates.optical[tsai.action.item][1])+(event.code=='ArrowUp'?-0.5:0.5);
       tsai.coordinates.optical[tsai.action.item][1]=nudge;
       document.getElementById('optical_coordinates_'+tsai.action.item+'_0_y').value=nudge;
       tsai.draw_clear(tsai.canvas.draw_context);
       tsai.optical_coordinates_draw();
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'ArrowLeft': ; // NO break
      case 'ArrowRight':
       if(typeof tsai.coordinates.optical[tsai.action.item][0]=='string' || isNaN(tsai.coordinates.optical[tsai.action.item][0])) break;
       var nudge=parseFloat(tsai.coordinates.optical[tsai.action.item][0])+(event.code=='ArrowLeft'?-0.5:0.5);
       tsai.coordinates.optical[tsai.action.item][0]=nudge;
       document.getElementById('optical_coordinates_'+tsai.action.item+'_0_x').value=nudge;
       tsai.draw_clear(tsai.canvas.draw_context);
       tsai.optical_coordinates_draw();
       event.stopPropagation();
       event.preventDefault();
       break;
     }
     break;
  }}
  
  optical_set()
  {var coordinates='';
   for(var index=0; index<4; index++) coordinates+='|'+tsai.coordinates.optical[index].join(',');
   if(tsai.coregistration_set('manual', coordinates, tsai.time_format().readable)) return true;
   else
   {tsai.json_warnings('<li>Manual coregistration unsuccessful</li>');
    return false;
  }}
  
  
  /* #######################################
     #######################################
     ##########                   ##########
     ##########   SED FUNCTIONS   ##########
     ##########                   ##########
     #######################################
     ####################################### */
  
  sed_crop()
  {for(var side=0; side<2; side++)
   {var pixels=parseFloat(document.getElementById('sed_crop_'+side).value);
    if(isNaN(pixels)) document.getElementById('sed_crop_'+side).value=tsai.mibi.sed_crop[['left', 'right'][side]];
    else document.getElementById('sed_crop_'+side).value=tsai.mibi.sed_crop[['left', 'right'][side]]=pixels;
   }
   tsai.coregistration_cookie_set();
  }
  
  sed_code()
  {var scan=(!isNaN(tsai.coordinates.sed[0][0]) && !(typeof tsai.coordinates.sed[0][0]=='string')
          && !isNaN(tsai.coordinates.sed[0][1]) && !(typeof tsai.coordinates.sed[0][1]=='string')
          && !isNaN(tsai.coordinates.sed[1][0]) && !(typeof tsai.coordinates.sed[1][0]=='string')
          && !isNaN(tsai.coordinates.sed[1][1]) && !(typeof tsai.coordinates.sed[1][1]=='string'));
   var b=tsai.navigation_code_clear()
   +' if(typeof sed===\'undefined\' || sed===null)'
   +' {var sed='
    + '{log: {name: \''+tsai.json.name.replaceAll('\'', '\\\'')+'\'},'
    + ' wait: function(milliseconds) {return new Promise(resolve=>{setTimeout(()=>{resolve(\'\')}, milliseconds);})},'
    + ' canvas: document.getElementsByTagName(\'canvas\')[2],'
    + ' filter: document.getElementsByTagName(\'canvas\')[2].getContext(\'2d\'),'
    + ' overlay: document.getElementsByTagName(\'canvas\')[3],'
    + ' context: document.getElementsByTagName(\'canvas\')[3].getContext(\'2d\'),'
    +  (scan?' coordinates: ['+tsai.coordinates.sed[0][0]+','+tsai.coordinates.sed[0][1]+','+tsai.coordinates.sed[1][0]+','+tsai.coordinates.sed[1][1]+'],':' coordinates: [null, null, null, null],')
    + ' shift: ['+(isNaN(tsai.coregistration.shift.x_x)?0:tsai.coregistration.shift.x_x)+','
                 +(isNaN(tsai.coregistration.shift.x_y)?0:tsai.coregistration.shift.x_y)+','
                 +(isNaN(tsai.coregistration.shift.y_x)?0:tsai.coregistration.shift.y_x)+','
                 +(isNaN(tsai.coregistration.shift.y_y)?0:tsai.coregistration.shift.y_y)+'],'
    + ' time_pad: function(number) {if(String(number).length==1) return \'0\'+number; else return String(number);},'
    + ' time:'
    +  ' function()'
    +  ' {var time=new Date();'
    +   ' return {ymd: time.getFullYear()+\'-\'+this.time_pad(time.getMonth()+1)+\'-\'+this.time_pad(time.getDate()),'
    +    ' mdy: (time.getMonth()+1)+\'/\'+time.getDate()+\'/\'+time.getFullYear(),'
    +    ' hms24: this.time_pad(time.getHours())+this.time_pad(time.getMinutes())+this.time_pad(time.getSeconds())};'
    +   '},'
    + ' jog:'
    +  ' function()'
    +  ' {if(document.getElementById(\'jogStagePopup\').hidden) document.getElementById(\'jogStageBtn\').click();'
    +   ' document.getElementById(\'inputJogIncrement\').value=5;'
    +   ' document.getElementById(\'inputJogIncrement\').dispatchEvent(new Event(\'input\'));'
    +   ' document.getElementsByClassName(\'crosshair\')[0].children[0].checked=false;'
    +   ' document.getElementsByClassName(\'crosshair\')[0].children[0].dispatchEvent(new Event(\'change\'));'
    +   ' document.getElementById(\'jogStageBtn\').click();'
    +   '},'
    + ' correction:'
    +  ' function(index)'
    +  ' {var to=parseFloat(prompt(\'Adjust \'+[\'x f(x)\', \'x f(y)\', \'y f(x)\', \'y f(y)\'][index]+\' correction from \'+this.shift[index]+\' to\'));'
    +   ' if(isNaN(to) || to==null || to>1 || to<-1) console.log(to+\' is not a valid setting. \'+[\'x f(x)\', \'x f(y)\', \'y f(x)\', \'y f(y)\'][index]+\' correction should be a decimal between -1 and 1, exclusive, most likely between -0.2 and 0.2.\');'
    +   ' else'
    +   ' {console.log([\'x f(x)\', \'x f(y)\', \'y f(x)\', \'y f(y)\'][index]+\' correction adjusted from \'+this.shift[index]+\' to \'+to);'
    +    ' this.shift[index]=to;'
    +    '}'
    +   ' return \'\';'
    +   '},'
    +   tsai.navigation_code_move()
    +   tsai.navigation_code_filter()
    + ' check_dwell: 10000,' // dwell time (ms)
    + ' check_dwell_set:'
    +  ' function()'
    +  ' {var dwell=parseFloat(prompt(\'Change dwell time from \'+(this.check_dwell/1000)+\' seconds to\'));'
    +   ' if(isNaN(dwell) || dwell==null || dwell<0.5 || dwell>120) console.log(dwell+\' is not a valid setting, must be a number between 0.5 and 120 seconds.\');'
    +   ' else'
    +   ' {console.log(\'Dwell time changed from \'+(this.check_dwell/1000)+\' seconds to \'+dwell);'
    +    ' this.check_dwell=dwell*1000;'
    +    '}'
    +   ' return \'\';'
    +   '},'
    + ' check_bracket:'
    +  ' function(marks, order)'
    +  ' {this.context.beginPath();'
    +   ' this.context.moveTo(marks[order[0]], marks[order[1]]);'
    +   ' this.context.lineTo(marks[order[2]], marks[order[3]]);'
    +   ' this.context.lineTo(marks[order[4]], marks[order[5]]);'
    +   ' this.context.stroke();'
    +   '},'
    + ' check_burn:'
    +  ' async function(start, y, x, last)'
    +  ' {var x_corrected=Math.round((start[0]+0.4*((x*(1+this.shift[0]))+(y*this.shift[1])))*10000)/10000;'
    +   ' var y_corrected=Math.round((start[1]-0.4*((y*(1+this.shift[3]))+(x*this.shift[2])))*10000)/10000;'
    +   ' this.target_x().value=x_corrected;'
    +   ' this.target_x().dispatchEvent(new Event(\'change\'));'
    +   ' this.target_x().dispatchEvent(new Event(\'input\'));'
    +   ' await this.wait(100);'
    +   ' this.target_y().value=y_corrected;'
    +   ' this.target_y().dispatchEvent(new Event(\'change\'));'
    +   ' this.target_y().dispatchEvent(new Event(\'input\'));'
    +   ' await this.wait(100);'
    +   ' if(!last) console.log([\'Top   \',\'Middle\',\'Bottom\'][y]+\' \'+[\'left  \',\'center\',\'right \'][x]+\': \'+x_corrected+\', \'+y_corrected);'
    +   ' this.target_move();'
    +   '},'
    + ' check:'
    +  ' async function(nine)'
    +  ' {var start=[parseFloat(document.getElementById(\'currentPosX\').value), parseFloat(document.getElementById(\'currentPosY\').value)];'
    +   ' console.log(\'\\nCheck [\'+this.shift.join(\', \')+\'] at \'+start[0]+\', \'+start[1]);'
    +   ' var fov=1300;'          // bracket check fov size
    +   ' this.context.clearRect(0, 0, this.overlay.width, this.overlay.height);'
    +   ' var magnification=this.magnification();'
    +   ' if(magnification==null) {console.log(\'Unable to set SED magnification, process halted.\'); return \'\';}'
    +   ' document.getElementById(\'selectFrame\').selectedIndex=4;' // set to 512x512
    +   ' document.getElementById(\'selectFrame\').dispatchEvent(new Event(\'change\'));'
    +   ' await this.wait(5000);'
    +   ' magnification.value=400;'
    +   ' magnification.dispatchEvent(new Event(\'input\'));'
    +   ' await this.wait(5000);'
    +   ' for(var row=0; row<3; row++)'
    +   ' {for(var column=0; column<3; column++)'
    +    ' {if(!nine && (row+column)%2!=0) continue;' // checkerboard pattern if only scan when (row+column)$2==0
    +     ' this.check_burn(start, row, column, false);'
    +     ' await this.wait(0.75*this.check_dwell);'
    +    '}}'
    +   ' this.check_burn(start, 1, 1, true);'
    +   ' magnification.value=fov;'
    +   ' magnification.dispatchEvent(new Event(\'input\'));'
    +   ' document.getElementById(\'selectFrame\').selectedIndex=4;' // set to 512x512
    +   ' document.getElementById(\'selectFrame\').dispatchEvent(new Event(\'change\'));'
    +   ' if(document.getElementById(\'targetPosX\'))'
    +   ' {var length=10;'         // bracket line length
    +    ' var width=2;'           // bracket line width
    +    ' var opacity=0.8;'       // bracket opacity
    +    ' var color=\'#e50808\';' // #6fc3ff
    +    ' var marks=[(fov-1200)*this.overlay.width/fov/2];'
    +    ' marks=marks.concat([marks[0]+length, this.overlay.width-marks[0]-length, this.overlay.width-marks[0], (this.overlay.width-length)/2, (this.overlay.width+length)/2]);'
    +    ' this.context.lineWidth=width;'
    +    ' this.context.strokeStyle=color;'
    +    ' this.context.globalAlpha=opacity;'
    +    ' this.check_bracket(marks, [0, 1, 0, 0, 1, 0]);'
    +    ' this.check_bracket(marks, [2, 0, 3, 0, 3, 1]);'
    +    ' this.check_bracket(marks, [3, 2, 3, 3, 2, 3]);'
    +    ' this.check_bracket(marks, [1, 3, 0, 3, 0, 2]);'
    +    ' this.context.globalAlpha=1;'
    +   '}},'
    + ' stop: false,'
    + ' scanning: false,'
    + ' scan_canvas: null,'
    + ' scan_context: null,'
    + ' scan_corners: [],'
    + ' scan_rows: -1,'
    + ' scan_columns: -1,'
    + ' scan_queue: [],'
    + ' scan_queue_clear:'
    +  ' function()'
    +  ' {this.scan_queue=[];'
    +   ' console.log(\'Rescan queue cleared.\');'
    +   '},'
    + ' scan_queue_add:'
    +  ' function()'
    +  ' {var coordinate=prompt(\'Enter zero-indexed row, column of the tile to add to the SED rescan queue, e.g. 8,0 is the ninth row, first column:\');'
    +   ' if(typeof coordinate==\'string\')'
    +   ' {var parse=coordinate.split(\',\');'
    +    ' if(parse.length==2)'
    +    ' {parse[0]=parseInt(parse[0]);'
    +     ' parse[1]=parseInt(parse[1]);'
    +     ' if(isNaN(parse[0]) || isNaN(parse[1]) || parse[0]<0 || parse[0]>=this.scan_rows || parse[1]<0 || parse[1]>=this.scan_columns) console.log(\'Tile \'+parse[0]+\', \'+parse[1]+\' not within [0-\'+this.scan_rows+\', 0-\'+this.scan_columns+\'].\');'
    +     ' else'
    +     ' {if(!this.scan_queue.includes(parse[0]+\',\'+parse[1])) this.scan_queue.push(parse[0]+\',\'+parse[1]);'
    +      ' console.log(\'Rescan queue: [\'+this.scan_queue.join(\'], [\')+\']\');'
    +   '}}}},'
    + ' scan:'
    +  ' async function()'
    +  ' {if(document.getElementById(\'selectMode\').value.indexOf(\'SED\')==-1) {console.log(\'To scan, please put the MIBI into SED mode and adjust the gain.\'); return;}'
    +   ' for(var coordinate=0; coordinate<4; coordinate++)'
    +   ' {if(this.coordinates[coordinate]===null)'
    +    ' {console.log(\'Scan coordinates invalid\');'
    +     ' return;'
    +    '}}'
    +   ' console.log(\'\\nSetting up scan\');'
    +   ' if(this.scanning) return \'\';'
    +   ' var magnification=this.magnification();'
    +   ' if(magnification==null) return \'\';'
    +   ' this.stop=false;'
    +   ' this.scanning=true;'
    +   ' var x_crop_left='+tsai.mibi.sed_crop.left+';'
    +   ' var x_crop_right='+tsai.mibi.sed_crop.right+';'
    +   ' var fov_microns_y=parseInt(magnification.max);' // read maximum fov size
    +   ' var fov_microns_x=parseInt(fov_microns_y*(1-x_crop_left-x_crop_right));' // set x shift
    +   ' console.log(\'Setting maximum FOV\');'
    +   ' if(magnification.value!=fov_microns_y)'
    +   ' {magnification.value=fov_microns_y;' // set fov to maximum
    +    ' magnification.dispatchEvent(new Event(\'input\'));'
    +    ' await this.wait(5000);'
    +    '}'
    +   ' console.log(\'Setting raster 256×256\');'
    +   ' if(document.getElementById(\'selectFrame\').selectedIndex!=3)'
    +   ' {document.getElementById(\'selectFrame\').selectedIndex=3;' // set to 256x256
    +    ' document.getElementById(\'selectFrame\').dispatchEvent(new Event(\'change\'));'
    +    ' await this.wait(5000);'
    +    '}'
    +   ' document.getElementById(\'selectZoom\').selectedIndex=0;'
    +   ' document.getElementById(\'selectZoom\').dispatchEvent(new Event(\'change\'));' // set 100% pixel magnification
    +   ' await this.wait(2500);'
    +   ' this.filter_crement(0, 0);' // set brightness and contrast
    +   ' this.scan_rows'+'=Math.max(1, Math.ceil(Math.ceil(Math.abs(this.coordinates[1]-this.coordinates[3])/fov_microns_y)));'
    +   ' this.scan_columns=Math.max(1, Math.ceil(Math.ceil(Math.abs(this.coordinates[0]-this.coordinates[2])/fov_microns_x)));'
    +   ' var start=[Math.floor(Math.min(this.coordinates[0], this.coordinates[2])+(fov_microns_y/2)), Math.ceil(Math.max(this.coordinates[1], this.coordinates[3])-(fov_microns_y/2))];'
    +   ' var fov_pixels_y=parseInt(document.getElementById(\'selectFrame\').value.split(\':\')[1]);'
    +   ' var fov_pixels_x=Math.floor(fov_pixels_y*(1-x_crop_left-x_crop_right));'
    +   ' var width=Math.round(fov_pixels_x*this.scan_columns);'
    +   ' var height=Math.round(fov_pixels_y*this.scan_rows);'
    +   ' if(this.scan_canvas==null || this.scan_queue.length==0)'
    +   ' {if(this.scan_canvas!=null) document.body.removeChild(this.scan_canvas);' // remove prior canvas
    +    ' this.scan_queue=[];'
    +    ' this.scan_canvas=document.createElement(\'canvas\');'
    +    ' this.scan_context=this.scan_canvas.getContext(\'2d\');'
    +    ' this.scan_canvas.style=\'display:none;\';'
    +    ' this.scan_canvas.width=width;'
    +    ' this.scan_canvas.height=height;'
    +    ' document.body.appendChild(this.scan_canvas);'
    +    ' this.scan_corners=['
          + 'width, height,' // original image width and height
          +' Math.round(((fov_pixels_y/2)-Math.round(fov_pixels_y*x_crop_left))*1000)/1000, fov_pixels_y/2,' // pixel center of top left tile x and y
          +' Math.round((width+(fov_pixels_y*x_crop_right)-(fov_pixels_y/2))*1000)/1000, Math.round((height-Math.round(fov_pixels_y/2))*1000)/1000,' // pixel center of bottom right tile x and y
          +' start[0], start[1], 0, 0, 0, 0, 0, 0, this.shift[0], this.shift[1], this.shift[2], this.shift[3]];' // micron center of top left tile x and y, top right, bottom left, bottom right
    +    '}'
    +   ' var time_start=new Date();'
    +   ' var index=0;'
    +   ' var last=[-8, -8];'
    +   ' for(var row=0; row<this.scan_rows; row++)'
    +   ' {if(this.stop)'
    +    ' {console.log(\'Scanning halted by user\');'
    +     ' break;'
    +     '}'
    +    ' for(var column=0; column<this.scan_columns; column++)'
    +    ' {if(this.stop) break;'
    +     ' if(this.scan_queue.length>0 && !this.scan_queue.includes(row+\',\'+column)) continue;' // check scan queue
    +     ' var x=parseInt(start[0]+((fov_microns_x*column*(1+this.shift[0]))+(this.shift[1]*row*fov_microns_y)));'
    +     ' var y=parseInt(start[1]-((fov_microns_y*row*(1+this.shift[3]))+(this.shift[2]*column*fov_microns_x)));'
    +     ' if(this.scan_queue.length==0)'
    +     ' {if(column==0 && row==this.scan_rows-1) {this.scan_corners[10]=x; this.scan_corners[11]=y;}' // bottom left
    +     '  else if(column==this.scan_columns-1)'
    +      ' {if(row==0) {this.scan_corners[8]=x; this.scan_corners[9]=y;}' // top right
    +       ' else if(row==this.scan_rows-1) {this.scan_corners[12]=x; this.scan_corners[13]=y;}' // bottom right
    +      '}}'
/*
    +     ' this.target_x().value=x/1000;'
    +     ' this.target_x().dispatchEvent(new Event(\'change\'));'
    +     ' this.target_x().dispatchEvent(new Event(\'input\'));'
    +     ' await this.wait(80);'
    +     ' this.target_y().value=y/1000;'
    +     ' this.target_y().dispatchEvent(new Event(\'change\'));'
    +     ' this.target_y().dispatchEvent(new Event(\'input\'));'
    +     ' await this.wait(80);'
    +     ' this.target_move();'
    +     ' console.log((index+1)+\'/\'+(this.scan_queue.length==0?this.scan_rows*this.scan_columns:this.scan_queue.length)+\' (\'+row+\', \'+column+\'): \'+x+\', \'+y);'
    +     ' await this.wait(row==last[0] && column==last[1]+1?2500:5000);'
*/
    +     ' var current={read_x: document.getElementById(\'currentPosX\'), read_y: document.getElementById(\'currentPosY\'), cycle: 0};'
    +     ' while(parseFloat(current.read_x.value)!=x/1000 || parseFloat(current.read_y.value)!=y/1000)'
    +     ' {while(document.getElementById(\'inputOptTPX\').disabled) await this.wait(100);'
    +      ' this.target_x().value=x/1000;'
    +      ' this.target_x().dispatchEvent(new Event(\'change\'));'
    +      ' this.target_x().dispatchEvent(new Event(\'input\'));'
    +      ' await this.wait(80);'
    +      ' while(document.getElementById(\'inputOptTPY\').disabled) await this.wait(100);'
    +      ' this.target_y().value=y/1000;'
    +      ' this.target_y().dispatchEvent(new Event(\'change\'));'
    +      ' this.target_y().dispatchEvent(new Event(\'input\'));'
    +      ' await this.wait(80);'
    +      ' this.target_move();'
    +      ' if(current.cycle==0) console.log((index+1)+\'/\'+(this.scan_queue.length==0?this.scan_rows*this.scan_columns:this.scan_queue.length)+\' (\'+row+\', \'+column+\'): \'+x+\', \'+y);'
    +      ' while(parseFloat(current.read_x.value)!=x/1000 || parseFloat(current.read_y.value)!=y/1000)'
    +      ' {if(current.cycle>=8 && !document.getElementById(\'inputOptTPX\').disabled) break;' // not at destination and not moving at 640ms -> abort wait and reinput
    +       ' await this.wait(80);' // otherwise wait until stopped moving
    +       ' current.cycle++;'
    +      '}}' // if at destination break to scan, otherwise not at destination and reinput
    +     ' await this.wait(880);' // wait for scan, roughly 638ms per scan at 256x256
    +     ' this.scan_context.drawImage(this.canvas, Math.ceil(fov_pixels_y*x_crop_left), 0, fov_pixels_x, fov_pixels_y, fov_pixels_x*column, fov_pixels_y*row, fov_pixels_x, fov_pixels_y);'
    +     ' last=[row, column];'
    +     ' index++;'
    +    '}}'
    +    'var file_name=\'sed_\'+this.time().ymd+\'-\'+this.time().hms24;'
    +    'var file_coordinates=\'_(\'+this.scan_corners.join(\',\')+\').png\';'
    +   ' this.scan_canvas.toBlob('
    +    ' (blob)=>'
    +    ' {var url=window.URL || window.webkitURL;'
    +     ' var anchor=document.createElement(\'a\');'
    +     ' anchor.href=url.createObjectURL(blob);'
    +     ' anchor.download=file_name+(file_name.length+file_coordinates.length>255?\'.png\':file_coordinates);'
    +     ' document.body.appendChild(anchor);'
    +     ' anchor.click();'
    +     ' document.body.removeChild(anchor);'
    +    '});'
    +   ' this.scan_queue=[];'
    +   ' console.log(\'Finished full SED: \'+(this.scan_rows*this.scan_columns)+\' FOVs, \'+fov_microns_x+\'×\'+fov_microns_y+\' μm at \'+(Math.round(fov_pixels_x*100)/100)+\'×\'+fov_pixels_y+\', \'+(Math.round(((new Date())-time_start)/100)/10)+\' seconds\\n\\n\');'
    +   ' this.scanning=false;'
    +   '},'
    +   tsai.navigation_code_sed_save()
    +   tsai.navigation_code_logger()
    + ' corner_move:'
    +  ' async function(corner)' // corner 0 is top left, 1 is bottom right
    +  ' {if(this.coordinates[2*corner]===null)'
    +   ' {console.log([\'Top left\', \'Bottom right\'][corner]+\' corner not set\');'
    +   ' return;'
    +    '}'
    +   ' this.target_x().value=this.coordinates[2*corner]/1000;'
    +   ' this.target_x().dispatchEvent(new Event(\'change\'));'
    +   ' this.target_x().dispatchEvent(new Event(\'input\'));'
    +   ' await this.wait(100);'
    +   ' this.target_y().value=this.coordinates[2*corner+1]/1000;'
    +   ' this.target_y().dispatchEvent(new Event(\'change\'));'
    +   ' this.target_y().dispatchEvent(new Event(\'input\'));'
    +   ' await this.wait(100);'
    +   ' this.target_move();'
    +   ' console.log([\'Top left\', \'Bottom right\'][corner]+\' corner, \'+(this.coordinates[2*corner]/1000)+\', \'+(this.coordinates[2*corner+1]/1000));'
    +   '},'
    + ' corner_set:'
    +  ' function(corner)' // corner 0 is top left, 1 is bottom right
    +  ' {var x=parseFloat(document.getElementById(\'currentPosX\').value)*1000;'
    +   ' var y=parseFloat(document.getElementById(\'currentPosY\').value)*1000;'
    +   ' if(isNaN(x) || isNaN(y)) {console.log(\'Cannot set corner to invalid coordinate\');}'
    +   ' var opposite=(corner==0?1:0);'
    +   ' if(this.coordinates[2*opposite]!==null || this.coordinates[2*opposite+1]!==null)'
    +   ' {var coordinates=[...this.coordinates];'
    +    ' coordinates[2*corner]=x;'
    +    ' coordinates[2*corner+1]=y;'
    +    ' if(coordinates[0]>coordinates[2]) {console.log([\'Top left\', \'Bottom right\'][corner]+\' corner cannot be set to the \'+[\'right\', \'left\'][corner]+\' of the \'+[\'bottom right\', \'top left\'][corner]+\' corner\'); return;}'
    +    ' if(coordinates[1]<coordinates[3]) {console.log([\'Top left\', \'Bottom right\'][corner]+\' corner cannot be set \'+[\'below\', \'above\'][corner]+\' the \'+[\'bottom right\', \'top left\'][corner]+\' corner\'); return;}'
    +    '}'
    +   ' this.coordinates[2*corner]=x;'
    +   ' this.coordinates[2*corner+1]=y;'
    +   ' console.log([\'Top left\', \'Bottom right\'][corner]+\' corner moved to \'+(x/1000)+\', \'+(y/1000));'
    +   '},'
    + ' key:'
    +  ' function(event)'
    +  ' {if(document.activeElement!=document.body) return;'
    +   ' switch(event.code)'
    +    '{'+tsai.navigation_code_arrows(512)
    +    ' case \'Digit1\': this.correction(0); break;'
    +    ' case \'Digit2\': this.correction(1); break;'
    +    ' case \'Digit3\': this.correction(2); break;'
    +    ' case \'Digit4\': this.correction(3); break;'
    +    ' case \'KeyA\'  : if(event.shiftKey) this.corner_set(0); else this.corner_move(0); break;'
    +    ' case \'KeyD\'  : if(event.shiftKey) this.corner_set(1); else this.corner_move(1); break;'
    +    ' case \'Digit5\': if(event.shiftKey) this.check(false); break;'
    +    ' case \'Digit9\': if(event.shiftKey) this.check(true); break;'
    +    ' case \'KeyM\'  : if(event.shiftKey) this.check_dwell_set(); break;'
    +    ' case \'KeyS\'  : this.sed(\'sed_[\'+this.shift.join(\',\')+\'].png\'); break;'
    +    ' case \'KeyB\'  : this.filter_crement(event.shiftKey?-0.1:0.1, 0); break;'
    +    ' case \'KeyC\'  : this.filter_crement(0, event.shiftKey?-0.1:0.1); break;'
    +    ' case \'KeyV\'  : if(event.shiftKey) this.filter_crement(1-this.filter_brightness, 1-this.filter_contrast); break;'
    +    ' case \'KeyT\'  : if(event.shiftKey) this.scan(); break;'
    +    ' case \'Slash\' : if(event.shiftKey && confirm(\'Are you sure you want to halt any ongoing scan?\')) {this.stop=true; this.scanning=false; break;}'
    +    ' case \'KeyR\'  : if(event.shiftKey) this.scan_queue_add(); break;'
    +    ' case \'KeyE\'  : if(event.shiftKey) this.scan_queue_clear(); break;'
    +    ' case \'KeyL\'  : this.logger(); break;'
    +    ' case \'KeyK\'  : this.commands(); break;'
    +    ' case \'Escape\': if(this.scanning && confirm(\'Are you sure you want to halt any ongoing scan?\')) {this.stop=true; this.scanning=false; this.exit();} else this.exit(); break;'
    +    '}'
    +   ' event.preventDefault();'
    +   ' return \'\';'
    +   '},'
    + ' commands:'
    +  ' function()'
    +  ' {console.log(\'\\n'
    +    '\\nMIBI SED Tile Tool'
    +    '\\nCopyright Albert G Tsai, MD, PhD'
    +    '\\n'
    +    '\\nControls:'
    +    '\\nK      : (K)eyboard command list'
    +    '\\n1      : Set x f(x) correction'
    +    '\\n2      : Set x f(y) correction'
    +    '\\n3      : Set y f(x) correction'
    +    '\\n4      : Set y f(y) correction'
    +    '\\nShift+5: Check corrections (5-square checkerboard)'
    +    '\\nShift+9: Check corrections (3×3)'
    +    '\\nShift+M: Set check dwell time (ms)'
    +    '\\nS      : Save corrections to PNG'
    +    '\\n'
    +    '\\nB      : Increase SED brightness'
    +    '\\nShift+B: Decrease SED brightness'
    +    '\\nC      : Increase SED contrast'
    +    '\\nShift+C: Decrease SED contrast'
    +    '\\nShift+V: Reset SED brightness and contrast'
    +    '\\n'
    +    '\\nShift+T: Start SED tile scan/stitch'
    +    '\\nShift+/: Halt  SED tile scan/stitch'
    +    '\\nA      : Check SED tile top left corner'
    +    '\\nD      : Check SED tile bottom right corner'
    +    '\\nShift+A: Set   SED tile top left corner'
    +    '\\nShift+D: Set   SED tile bottom right corner'
    +    '\\n'
    +    '\\nShift+R: Add tile to SED rescan queue'
    +    '\\nShift+E: Clear SED rescan queue'
    +    '\\n'
    +    '\\nUp    / Shift+ / Alt (Option)+: Jog up    2 / 3 / 1'
    +    '\\nDown  / Shift+ / Alt (Option)+: Jog down  2 / 3 / 1'
    +    '\\nLeft  / Shift+ / Alt (Option)+: Jog left  2 / 3 / 1'
    +    '\\nRight / Shift+ / Alt (Option)+: Jog right 2 / 3 / 1'
    +    '\\nL: (L)og kV and nA values for Google Sheet'
    +    '\\nEsc: Exit (unbind keys)\\n\\n\');'
    +   '},'
    + ' instructions:'
    +  ' function()'
    +  ' {var coordinates=\''+(scan?'Type Shift+T to start the scan. Type Shift+/ to end the SED scan and':'SED tile coordinates have not been entered. Type')+'\';'
    +   ' console.log(\'Click on a blank area of the page (not a text box or image) to use the above controls. Switch to SED Mode, set the imaging mode to QC - 300 µm, adjust the gain, and focus the image. \'+coordinates+\' Escape to exit.\\n\\n\');'
    +   '},'
    + ' exit:'
    +  ' function()'
    +  ' {if(this.scan_canvas!=null) document.body.removeChild(this.scan_canvas);'
    +   ' this.filter_crement(1-this.filter_brightness, 1-this.filter_contrast);'
    +   ' document.removeEventListener(\'keydown\', sed_key, false);'
    +   ' sed=null;'
    +   ' console.log(\'Exited\\nMIBI SED Tile Tool\\nCopyright Albert G Tsai, MD, PhD\\n\\n\');'
    +   ' return \'\';'
    +   '}'
    +'};}'
   +' sed.jog();'
   +' setTimeout(()=>'
   + '{if(typeof sed_key===\'undefined\') {sed_key=function(event) {sed.key(event);}}'
   + ' document.addEventListener(\'keydown\', sed_key, false);'
   + ' console.clear();'
   + ' sed.commands();'
   + ' sed.instructions();'
   + '}, document.getElementById(\'selectedImagingPreset\').selectedIndex!=3?9000:0);'
   +' if(document.getElementById(\'selectedImagingPreset\').selectedIndex!=3)'
   +' {document.getElementById(\'selectedImagingPreset\').selectedIndex=3;'
   + ' document.getElementById(\'selectedImagingPreset\').dispatchEvent(new Event(\'change\'));'
   + ' setTimeout(()=>{console.log(\'Please wait 8 seconds.\');}, 1000);'
   + '}'
   navigator.clipboard.writeText(b);
  }
  
  sed_shift_set(shift)
  {if(typeof shift=='object')
   {for(var index=0; index<2; index++)
    {for(var axis=0; axis<2; axis++) document.getElementById('sed_shift_'+['x', 'y'][index]+'_'+['x', 'y'][axis]).value=shift[2*index+axis+1];
   }}
   for(var index=0; index<2; index++)
   {for(var axis=0; axis<2; axis++)
    {var input=document.getElementById('sed_shift_'+['x', 'y'][index]+'_'+['x', 'y'][axis]);
     var value=parseFloat(input.value);
     if(isNaN(value)) input.value=tsai.coregistration.shift[['x', 'y'][index]+'_'+['x', 'y'][axis]];
     else tsai.coregistration.shift[['x', 'y'][index]+'_'+['x', 'y'][axis]]=value;
   }}
   tsai.coregistration_cookie_set();
  }
  
  sed_coordinates_draw()
  {tsai.draw_clear(tsai.canvas.draw_context);
   var corners={input:[], tl:{x: 0, y: 0}, tr:{x: 0, y: 0}, bl:{x: 0, y: 0}, br:{x: 0, y: 0}};
   for(var index=0; index<2; index++)
   {if(isNaN(tsai.coordinates.sed[index][0]) || isNaN(tsai.coordinates.sed[index][1]) || typeof tsai.coordinates.sed[index][0]=='string' || typeof tsai.coordinates.sed[index][1]=='string') continue;
    else corners.input.push({x: tsai.coordinates.sed[index][0], y: tsai.coordinates.sed[index][1], optical: tsai.coregistration_from_micron(tsai.image.transform, {x: tsai.coordinates.sed[index][0], y: tsai.coordinates.sed[index][1]})});
   }
   if(corners.input.length==2)
   {var left, top, width, height;
    if(corners.input[0].x<corners.input[1].x) {left=corners.input[0].x; width=corners.input[1].x-corners.input[0].x;}
    else                                      {left=corners.input[1].x; width=corners.input[0].x-corners.input[1].x;}
    if(corners.input[0].y>corners.input[1].y) {top=corners.input[0].y; height=corners.input[0].y-corners.input[1].y;}
    else                                      {top=corners.input[1].y; height=corners.input[1].y-corners.input[0].y;}
    corners.tl=tsai.coregistration_from_micron(tsai.image.transform, {x: left, y: top});
    corners.tr=tsai.coregistration_from_micron(tsai.image.transform, {x: left+width*(1+tsai.coregistration.shift.x_x), y: top-width*tsai.coregistration.shift.y_x});
    corners.br=tsai.coregistration_from_micron(tsai.image.transform, {x: left+width*(1+tsai.coregistration.shift.x_x)+height*tsai.coregistration.shift.x_y, y: top-width*tsai.coregistration.shift.y_x-height*(1+tsai.coregistration.shift.y_y)});
    corners.bl=tsai.coregistration_from_micron(tsai.image.transform, {x: left+height*tsai.coregistration.shift.x_y, y: top-height*(1+tsai.coregistration.shift.y_y)});
    /* tsai.draw_line(tsai.canvas.draw_context, corners.tl, corners.tr, tsai.coordinates.line_color_default, tsai.coordinates.line_thickness);
       tsai.draw_line(tsai.canvas.draw_context, corners.tr, corners.br, tsai.coordinates.line_color_default, tsai.coordinates.line_thickness);
       tsai.draw_line(tsai.canvas.draw_context, corners.br, corners.bl, tsai.coordinates.line_color_default, tsai.coordinates.line_thickness);
       tsai.draw_line(tsai.canvas.draw_context, corners.bl, corners.tl, tsai.coordinates.line_color_default, tsai.coordinates.line_thickness); */
    tsai.canvas.draw_context.beginPath();
    tsai.canvas.draw_context.moveTo(corners.tl.x-tsai.image.crop, corners.tl.y);
    tsai.canvas.draw_context.lineTo(corners.tr.x-tsai.image.crop, corners.tr.y);
    tsai.canvas.draw_context.lineTo(corners.br.x-tsai.image.crop, corners.br.y);
    tsai.canvas.draw_context.lineTo(corners.bl.x-tsai.image.crop, corners.bl.y);
    tsai.canvas.draw_context.lineTo(corners.tl.x-tsai.image.crop, corners.tl.y);
    /* console.log(left+'\t'+top
     +'\n'+(left+width*(1+tsai.coregistration.shift.x_x))+'\t'+(top-width*tsai.coregistration.shift.y_x)
     +'\n'+(left+width*(1+tsai.coregistration.shift.x_x)+height*tsai.coregistration.shift.x_y)+'\t'+(top-width*tsai.coregistration.shift.y_x-height*(1+tsai.coregistration.shift.y_y))
     +'\n'+(left+height*tsai.coregistration.shift.x_y)+'\t'+(top-height*(1+tsai.coregistration.shift.y_y+'\n')));
    */
    tsai.canvas.draw_context.globalAlpha=tsai.canvas.hover_fill_opacity/2;
    tsai.canvas.draw_context.fillStyle=tsai.coordinates.line_color_default;
    tsai.canvas.draw_context.fill();
    tsai.canvas.draw_context.globalAlpha=tsai.canvas.hover_line_opacity/2;
   }
   if(corners.input.length==2)
   {tsai.canvas.draw_context.globalAlpha=tsai.coordinates.line_opacity/2;
    tsai.draw_rect(tsai.canvas.draw_context, corners.input[0].optical, corners.input[1].optical, tsai.coordinates.line_color_default);
   }
   tsai.canvas.draw_context.globalAlpha=tsai.coordinates.line_opacity
   for(var index=0; index<corners.input.length; index++)
   {tsai.draw_line(tsai.canvas.draw_context, {x: corners.input[index].optical.x-tsai.coordinates.crosshair, y: corners.input[index].optical.y}, {x: corners.input[index].optical.x+tsai.coordinates.crosshair, y: corners.input[index].optical.y}, tsai.coordinates.line_colors[index][0], tsai.coordinates.line_thickness);
    tsai.draw_line(tsai.canvas.draw_context, {x: corners.input[index].optical.x, y: corners.input[index].optical.y-tsai.coordinates.crosshair}, {x: corners.input[index].optical.x, y: corners.input[index].optical.y+tsai.coordinates.crosshair}, tsai.coordinates.line_colors[index][0], tsai.coordinates.line_thickness);
   }
   tsai.canvas.draw_context.globalAlpha=1;
  }
  
  sed_coordinates(selected) // sets up sed_action
  {for(var index=0; index<2; index++) // store inputs to tsai.coordinates.sed
   {for(var axis=0; axis<2; axis++)
    {var value=parseFloat(document.getElementById('sed_coordinates_'+index+'_'+['x', 'y'][axis]).value);
     if(!isNaN(value)) tsai.coordinates.sed[index][axis]=value;
   }}
   if(!tsai.menus_close()) return false;
   document.getElementById('sed_coordinates_'+selected).checked=true;
   tsai.action.type='sed';
   tsai.action.item=selected; // determines which point to move
   if(tsai.images.optical.loaded)
   {tsai.image_tab('optical', tsai.images.optical.scale);
    tsai.sed_coordinates_draw();
  }}
  
  sed_action(type, event, position)
  {if(!tsai.images.optical.loaded || !tsai.menus_close()) return;
   switch(type)
   {case 'mousemove': if(!tsai.action.mouse_dragged) break; // NO forced break; only continue to draw if mousedown and dragged
    case 'mouseup':
     var micron=tsai.coregistration_to_micron(tsai.image.transform, position);
     tsai.coordinates.sed[tsai.action.item][0]=micron.x;
     tsai.coordinates.sed[tsai.action.item][1]=micron.y;
     document.getElementById('sed_coordinates_'+tsai.action.item+'_x').value=micron.x;
     document.getElementById('sed_coordinates_'+tsai.action.item+'_y').value=micron.y;
     tsai.draw_clear(tsai.canvas.draw_context);
     tsai.sed_coordinates_draw();
     if(type!='mousemove') tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
    case 'mouseover': tsai.canvas.draw.style.cursor='var(--crosshair)'; break;
    case 'mousedown': tsai.canvas.draw.style.cursor='none'; break;
    case 'keydown':
     switch(event.code)
     {case 'KeyA':
       if(tsai.action.item==1)
       {tsai.action.item=0;
        document.getElementById('sed_coordinates_0').checked=true;
       }
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'KeyD':
       if(tsai.action.item==0)
       {tsai.action.item=1;
        document.getElementById('sed_coordinates_1').checked=true;
       }
       event.stopPropagation();
       event.preventDefault();
       break;
     }
     break;
  }}
  
  
  /* ###############################################
     ###############################################
     ##########                           ##########
     ##########   TILE ACTION FUNCTIONS   ##########
     ##########                           ##########
     ###############################################
     ############################################### */
  
  /* ############################
     ##########  MOVE  ##########
     ############################ */
  move_load(tile)
  {if(!tsai.menus_close()) return;
   tsai.action_prerender('move', tile, false);
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   if(tsai.tiles[tile].active)
   {tsai.tile_draw(tsai.canvas.draw_context, tile, tsai.tiles[tile].fov.centerPointMicrons.x, tsai.tiles[tile].fov.centerPointMicrons.y, true);
  }}
  
  move_nudge(event, tile, x_nudge, y_nudge)
  {var micron_x=tsai.tiles[tile].fov.centerPointMicrons.x+((event.shiftKey?tsai.action.nudge_shift:event.altKey?tsai.action.nudge_opt:tsai.action.nudge)*x_nudge);
   var micron_y=tsai.tiles[tile].fov.centerPointMicrons.y+((event.shiftKey?tsai.action.nudge_shift:event.altKey?tsai.action.nudge_opt:tsai.action.nudge)*y_nudge);
   tsai.tiles[tile].fov.centerPointMicrons.x=micron_x;
   tsai.tiles[tile].fov.centerPointMicrons.y=micron_y;
   var optical=tsai.coregistration_from_micron(tsai.image.transform, {x: micron_x, y: micron_y});
   document.getElementById('tile_'+tile+'_center_x').value=Math.round(micron_x*100)/100;
   document.getElementById('tile_'+tile+'_center_y').value=Math.round(micron_y*100)/100;
   document.getElementById('tile_'+tile+'_pixels_x').value=Math.round(optical.x*100)/100;
   document.getElementById('tile_'+tile+'_pixels_y').value=Math.round(optical.y*100)/100;
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   tsai.tile_draw(tsai.canvas.draw_context, tile, micron_x, micron_y, true);
  }
  
  move_action(type, event, position)
  {var active=tsai.tiles[tsai.action.item].active;
   switch(type)
   {/* ##########  MOUSEMOVE  ########## */
    case 'mouseup':
    case 'mousemove':
     if(!active) return;
     if(tsai.action.mouse_dragged)
     {var optical=tsai.coregistration_from_micron(tsai.image.transform, {x: tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, y: tsai.tiles[tsai.action.item].fov.centerPointMicrons.y});
      var optical_x=optical.x+position.x-tsai.action.mouse_down.x;
      var optical_y=optical.y+position.y-tsai.action.mouse_down.y;
      var microns=tsai.coregistration_to_micron(tsai.image.transform, {x: optical_x, y: optical_y});
      document.getElementById('tile_'+tsai.action.item+'_center_x').value=microns.x;
      document.getElementById('tile_'+tsai.action.item+'_center_y').value=microns.y;
      document.getElementById('tile_'+tsai.action.item+'_pixels_x').value=optical_x;
      document.getElementById('tile_'+tsai.action.item+'_pixels_y').value=optical_y;
      tsai.draw_clear(tsai.canvas.draw_context);
      tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
      tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, microns.x, microns.y, true);
      if(type=='mouseup')
      {tsai.tiles[tsai.action.item].fov.centerPointMicrons.x=microns.x;
       tsai.tiles[tsai.action.item].fov.centerPointMicrons.y=microns.y;
       tsai.canvas.draw.style.cursor='grab';
     }}
     break;
    case 'mousedown':
     if(!active) return;
     tsai.canvas.draw.style.cursor='grabbing';
     break;
    case 'mouseout':
     if(!active) return;
     tsai.draw_clear(tsai.canvas.draw_context);
     tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
     tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, tsai.tiles[tsai.action.item].fov.centerPointMicrons.y, false);
     // NO break;
    case 'mouseover':
     if(!active) return;
     tsai.action_prerender('move', tsai.action.item, false);
     tsai.draw_clear(tsai.canvas.draw_context);
     tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
     tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, tsai.tiles[tsai.action.item].fov.centerPointMicrons.y, true);
     tsai.canvas.draw.style.cursor='grab';
     break;
    /* ##########  KEYDOWN  ########## */
    case 'keydown':
     if(isNaN(tsai.action.item) || tsai.action.item<0 || tsai.action.item>=tsai.tiles.length) return;
     if(document.activeElement!=document.getElementById('tile_'+tsai.action.item+'_move') && document.activeElement!=document.body) return;
     if(document.activeElement.tagName.toLowerCase()=='textarea' || (document.activeElement.tagName.toLowerCase()=='input' && document.activeElement.type=='text')) return;
     switch(event.code)
     {case 'ArrowUp'   : if(!active) return; tsai.move_nudge(event, tsai.action.item,  0,  1); event.stopPropagation(); event.preventDefault(); break;
      case 'ArrowDown' : if(!active) return; tsai.move_nudge(event, tsai.action.item,  0, -1); event.stopPropagation(); event.preventDefault(); break;
      case 'ArrowLeft' : if(!active) return; tsai.move_nudge(event, tsai.action.item, -1,  0); event.stopPropagation(); event.preventDefault(); break;
      case 'ArrowRight': if(!active) return; tsai.move_nudge(event, tsai.action.item,  1,  0); event.stopPropagation(); event.preventDefault(); break;
      case 'KeyT':
       document.getElementById('tile_'+tsai.action.item+'_active').checked=(!document.getElementById('tile_'+tsai.action.item+'_active').checked);
       tsai.tile_hover_click(tsai.action.item);
       document.getElementById('tile_'+tsai.action.item+'_move').focus();
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'Digit2': ;
      case 'Digit4': ;
      case 'Digit8':
       if(!active) return;
       var buttons={Digit2: 200, Digit4: 400, Digit8: 800};
       var fov=parseInt(document.getElementById('tile_'+tsai.action.item+'_fov').value);
       if(fov!=buttons[event.code])
       {document.getElementById('tile_'+tsai.action.item+'_fov').value=buttons[event.code];
        document.getElementById('tile_'+tsai.action.item+'_fov').dispatchEvent(new Event('change'));
        var raster=parseInt(parseInt(document.getElementById('tile_'+tsai.action.item+'_raster').value)*buttons[event.code]/fov);
        if(tsai.mibi.rasters.includes(raster))
        {document.getElementById('tile_'+tsai.action.item+'_raster').value=raster;
         document.getElementById('tile_'+tsai.action.item+'_raster').dispatchEvent(new Event('change')); 
        }
        else tsai.json_warnings('<li>'+document.getElementById('tile_'+tsai.action.item+'_name').value+' raster could not be set to '+raster+'</li>');
       }
       document.getElementById('tile_'+tsai.action.item+'_move').focus();
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'KeyD':
       var tiles_length=tsai.tiles.length;
       for(var tile=tsai.action.item+1; tile<tiles_length; tile++)
       {if(tsai.tiles[tile].active)
        {tsai.action_prerender('move', tile, false);
         tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, tsai.tiles[tsai.action.item].fov.centerPointMicrons.y, true);
         document.getElementById('tile_'+tile+'_move').click();
         document.getElementById('tile_'+tile+'_move').focus();
         break;
       }}
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'KeyA':
       for(var tile=tsai.action.item-1; tile>=0; tile--)
       {if(tsai.tiles[tile].active)
        {tsai.action_prerender('move', tile, false);
         tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, tsai.tiles[tsai.action.item].fov.centerPointMicrons.y, true);
         document.getElementById('tile_'+tile+'_move').click();
         document.getElementById('tile_'+tile+'_move').focus();
         break;
       }}
       event.stopPropagation();
       event.preventDefault();
     }
     break;
  }}
  
  /* ###############################
     ##########  CORNERS  ##########
     ############################### */
  corners_coordinates_load(options, row, column, tl, tr, br, bl)
  {tsai.scratch.corners.fovs++;
   var x0=Math.min(tl.x, bl.x);
   var x1=Math.max(tr.x, br.x);
   var y0=Math.min(tl.y, tr.y); // pixel coordinates are from top left, so y0 = up = lower y, y1 = down = higher y
   var y1=Math.max(bl.y, br.y);
   if(tsai.scratch.corners.columns[column].length==0) tsai.scratch.corners.columns[column]=[x0, x1];
   else
   {if(x0<tsai.scratch.corners.columns[column][0]) tsai.scratch.corners.columns[column][0]=x0;
    if(x1>tsai.scratch.corners.columns[column][1]) tsai.scratch.corners.columns[column][1]=x1;
   }
   if(tsai.scratch.corners.rows[row].length==0) tsai.scratch.corners.rows[row]=[y0, y1];
   else
   {if(y0<tsai.scratch.corners.rows[row][0]) tsai.scratch.corners.rows[row][0]=y0;
    if(y1>tsai.scratch.corners.rows[row][1]) tsai.scratch.corners.rows[row][1]=y1;
   }
   tsai.scratch.corners.map[row][column]=[x0, x1, y0, y1, [[bl.x, bl.y], [br.x, br.y], [tr.x, tr.y], [tl.x, tl.y]]];
  }
  
  corners_coordinates(tile)
  {tsai.scratch.corners={fovs: 0, left: 0, right: 0, top: 0, bottom: 0, rows: [], columns: [], map: []};
   var rows=tsai.tiles[tile].map.length;
   var columns=tsai.tiles[tile].map[0].length;
   for(var row=0; row<rows; row++)
   {tsai.scratch.corners.rows.push([]);
    tsai.scratch.corners.map[row]=[];
    for(var column=0; column<columns; column++)
    {tsai.scratch.corners.map[row][column]=[];
     if(row==0) tsai.scratch.corners.columns.push([]);
   }}
   tsai.tile_fov_corners(tile, tsai.tiles[tile].fov.centerPointMicrons.x, tsai.tiles[tile].fov.centerPointMicrons.y, tsai.corners_coordinates_load, ''); // calls tsai.corners_coordinates_load
   tsai.scratch.corners.left=tsai.scratch.corners.columns[0][0];
   tsai.scratch.corners.right=tsai.scratch.corners.columns[tsai.scratch.corners.columns.length-1][1];
   tsai.scratch.corners.top=tsai.scratch.corners.rows[0][0];
   tsai.scratch.corners.bottom=tsai.scratch.corners.rows[tsai.scratch.corners.rows.length-1][1];
  }
  
  corners_find(position)
  {var row=-1;
   var column=-1;
   if('map' in tsai.scratch.corners && position.y>=tsai.scratch.corners.top && position.y<=tsai.scratch.corners.bottom && position.x>=tsai.scratch.corners.left && position.x<=tsai.scratch.corners.right)
   {var bounds=[[0, tsai.scratch.corners.rows.length-1], [0, tsai.scratch.corners.columns.length-1]];
    if(tsai.scratch.corners.fovs>9)
    {while(position.y>tsai.scratch.corners.rows[   bounds[0][0]][0] && bounds[0][0]<bounds[0][1]) bounds[0][0]++;
     while(position.y<tsai.scratch.corners.rows[   bounds[0][1]][1] && bounds[0][1]>bounds[0][0]) bounds[0][1]--;
     while(position.x>tsai.scratch.corners.columns[bounds[1][0]][0] && bounds[1][0]<bounds[1][1]) bounds[1][0]++;
     while(position.x<tsai.scratch.corners.columns[bounds[1][1]][1] && bounds[1][1]>bounds[0][1]) bounds[1][1]--;
     if(bounds[0][0]!=0) bounds[0][0]--;
     if(bounds[0][1]!=tsai.scratch.corners.rows.length-1) bounds[0][1]++;
     if(bounds[1][0]!=0) bounds[1][0]--;
     if(bounds[1][1]!=tsai.scratch.corners.columns.length-1) bounds[1][1]++;
    }
    for(row=bounds[0][0]; row<=bounds[0][1]; row++)
    {for(column=bounds[1][0]; column<=bounds[1][1]; column++)
     {var cell=tsai.scratch.corners.map[row][column];
      if(position.x<cell[0] || position.x>cell[1] || position.y<cell[2] || position.y>cell[3]) continue;
      if(tsai.polygon_in([position.x, position.y], cell[4])) return [row, column];
   }}}
   return [];
  }
  
  /* #############################
     ##########  CLICK  ##########
     ############################# */
  click_load(tile)
  {if(!tsai.menus_close()) return;
   tsai.tile_expand(tile);
   tsai.corners_coordinates(tile);
   tsai.action_prerender('click', tile, false);
   // tsai.tile_map_resize(tile);
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   if(tsai.tiles[tile].active) tsai.tile_draw(tsai.canvas.draw_context, tile, tsai.tiles[tile].fov.centerPointMicrons.x, tsai.tiles[tile].fov.centerPointMicrons.y, true);
  }
  
  click_action(type, event, position)
  {if(!tsai.tiles[tsai.action.item].active) return;
   switch(type)
   {case 'mousemove':
     if(tsai.action.mouse_dragged)
     {var rc=tsai.corners_find(position);
      if(rc.length==2)
      {tsai.tiles[tsai.action.item].map[rc[0]][rc[1]]=1;
       document.getElementById('tile_'+tsai.action.item+'_map_'+rc[0]+'_'+rc[1]).checked=true;
     }}
    break;
    case 'mouseup':
     if(!tsai.action.mouse_dragged)
     {var rc=tsai.corners_find(position);
      if(rc.length==2)
      {var checked=(tsai.tiles[tsai.action.item].map[rc[0]][rc[1]]!=0);
       tsai.tiles[tsai.action.item].map[rc[0]][rc[1]]=(checked?0:1);
       document.getElementById('tile_'+tsai.action.item+'_map_'+rc[0]+'_'+rc[1]).checked=(checked?false:true);
     }}
     break;
    case 'mouseover':
     tsai.action_prerender('click', tsai.action.item, false);
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
   }
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, tsai.tiles[tsai.action.item].fov.centerPointMicrons.y, true);
  }
  
  /* #############################
     ##########  ERASE  ##########
     ############################# */
  erase_load(tile)
  {if(!tsai.menus_close()) return;
   tsai.corners_coordinates(tile);
   tsai.action_prerender('erase', tile, false);
   // tsai.tile_map_resize(tile);
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   if(tsai.tiles[tile].active)
   {tsai.tile_draw(tsai.canvas.draw_context, tile, tsai.tiles[tile].fov.centerPointMicrons.x, tsai.tiles[tile].fov.centerPointMicrons.y, true);
  }}
  
  erase_action(type, event, position)
  {if(!tsai.tiles[tsai.action.item].active) return;
   switch(type)
   {case 'mousemove':
     if(tsai.action.mouse_dragged)
     {var rc=tsai.corners_find(position);
      if(rc.length==2)
      {tsai.tiles[tsai.action.item].map[rc[0]][rc[1]]=0;
       document.getElementById('tile_'+tsai.action.item+'_map_'+rc[0]+'_'+rc[1]).checked=false;
     }}
    break;
    case 'mouseup':
     if(!tsai.action.mouse_dragged)
     {var rc=tsai.corners_find(position);
      if(rc.length==2)
      {tsai.tiles[tsai.action.item].map[rc[0]][rc[1]]=0;
       document.getElementById('tile_'+tsai.action.item+'_map_'+rc[0]+'_'+rc[1]).checked=false;
     }}
     break;
    case 'mouseover':
     tsai.action_prerender('erase', tsai.action.item, false);
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
   }
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   tsai.tile_draw(tsai.canvas.draw_context, tsai.action.item, tsai.tiles[tsai.action.item].fov.centerPointMicrons.x, tsai.tiles[tsai.action.item].fov.centerPointMicrons.y, true);
  }
  
  /* #################################
     ##########  DUPLICATE  ##########
     ################################# */
  duplicate_load(tile)
  {if(!tsai.menus_close()) return;
   tsai.action_prerender('duplicate', tile, true);
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
  }
  
  duplicate_action(type, event, position)
  {switch(type)
   {case 'mousemove':
     if(tsai.action.mouse_dragged)
     {tsai.draw_clear(tsai.canvas.draw_context);
      tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
      tsai.draw_rect(tsai.canvas.draw_context, tsai.action.mouse_down, position, tsai.canvas.line_colors[tsai.tiles.length%tsai.canvas.line_colors.length][0]);
     }
     break;
    case 'mouseup':
     tsai.duplicate_tile(tsai.action.item, tsai.action.mouse_down, position);
     break;
    case 'mouseover':
     tsai.action_prerender('duplicate', tsai.action.item, true);
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
  }}
  
  duplicate_tile(tile, start, end)
  {// determine top left of dragged rectangle and calculate first tile centroid
   var micron_start=tsai.coregistration_to_micron(tsai.image.transform, {x: start.x, y: start.y});
   var micron_end  =tsai.coregistration_to_micron(tsai.image.transform, {x: end.x  , y: end.y});
   var top_left={x: Math.min(micron_start.x, micron_end.x), y: Math.max(micron_start.y, micron_end.y)};
   var tile_new=tsai.tiles.push(JSON.parse(JSON.stringify(tsai.tiles[tile])))-1;
   tsai.tiles[tile_new].fov.name='';
   if(!tsai.action.mouse_dragged && tsai.action.type!='polygon')
   {tsai.tiles[tile_new].fov.centerPointMicrons.x=top_left.x-(tsai.tiles[tile_new].fov.fovSizeMicrons*(tsai.tiles[tile_new].map[0].length-1)/2);
    tsai.tiles[tile_new].fov.centerPointMicrons.y=top_left.y+(tsai.tiles[tile_new].fov.fovSizeMicrons*(tsai.tiles[tile_new].map.length-1)/2);
   }
   else
   {var fov=tsai.tiles[tile_new].fov.fovSizeMicrons;
    var fov_half=fov/2;
    var top_centroid=top_left.x+fov_half;
    var left_centroid=top_left.y-fov_half;
    tsai.tiles[tile_new].fov.centerPointMicrons.x=top_centroid;
    tsai.tiles[tile_new].fov.centerPointMicrons.y=left_centroid;
    if((start.x!=end.x && start.y!=end.y) || tsai.scratch.polygon.length>0)
    {var bottom_right={x: Math.max(micron_start.x, micron_end.x), y: Math.min(micron_start.y, micron_end.y)};
     var rows   =Math.max(1, Math.ceil(Math.abs(bottom_right.y-top_left.y)/fov));
     var columns=Math.max(1, Math.ceil(Math.abs(bottom_right.x-top_left.x)/fov));
     if(isNaN(rows) || isNaN(columns)) return;
     tsai.tiles[tile_new].map=[];
     for(var row=0; row<rows; row++)
     {tsai.tiles[tile_new].map[row]=[];
      for(var column=0; column<columns; column++) tsai.tiles[tile_new].map[row][column]=1;
   }}}
   tsai.tiles_write(tile_new);
   tsai.tiles[tile_new].original={fov: JSON.stringify(tsai.tiles[tile_new].fov), map: JSON.stringify(tsai.tiles[tile_new].map)};
   document.getElementById('tile_'+tile_new+'_name').focus();
  }
  
  /* ###############################
     ##########  POLYGON  ##########
     ############################### */
  polygon_example()
  {var radius=32;
   var example='{"notes":"Each area (polygon) to be imaged is defined by a list of x, y vertex coordinates in optical pixel units. name is optional. The file must have a .json extension.",'
   +'"polygons":['
   +'{"name":"Polygon1",'
    +'"coordinates":['
    +'{"x":'+(radius*Math.cos(1.5*Math.PI)+600)+',"y":'+(radius*Math.sin(1.5*Math.PI)+500)+'},'
    +'{"x":'+(radius*Math.cos(2.3*Math.PI)+600)+',"y":'+(radius*Math.sin(2.3*Math.PI)+500)+'},'
    +'{"x":'+(radius*Math.cos(3.1*Math.PI)+600)+',"y":'+(radius*Math.sin(3.1*Math.PI)+500)+'},'
    +'{"x":'+(radius*Math.cos(3.9*Math.PI)+600)+',"y":'+(radius*Math.sin(3.9*Math.PI)+500)+'},'
    +'{"x":'+(radius*Math.cos(4.7*Math.PI)+600)+',"y":'+(radius*Math.sin(4.7*Math.PI)+500)+'}'
    +']},'
   +'{"name":"Polygon2",'
    +'"coordinates":['
    +'{"x":'+(radius*Math.cos( 3*Math.PI/6)+500)+',"y":'+(radius*Math.sin( 3*Math.PI/6)+800)+'},'
    +'{"x":'+(radius*Math.cos( 7*Math.PI/6)+500)+',"y":'+(radius*Math.sin( 7*Math.PI/6)+800)+'},'
    +'{"x":'+(radius*Math.cos(11*Math.PI/6)+500)+',"y":'+(radius*Math.sin(11*Math.PI/6)+800)+'},'
    +'{"x":'+(radius/2                     +500)+',"y":'+                               800 +'},'
    +'{"x":'+(radius*Math.cos(13*Math.PI/6)+500)+',"y":'+(radius*Math.sin(13*Math.PI/6)+800)+'},'
    +'{"x":'+(radius*Math.cos(17*Math.PI/6)+500)+',"y":'+(radius*Math.sin(17*Math.PI/6)+800)+'},'
    +'{"x":'+(radius*Math.cos(21*Math.PI/6)+500)+',"y":'+(radius*Math.sin(21*Math.PI/6)+800)+'},'
    +'{"x":'+(radius/2                     +500)+',"y":'+                               800 +'}'
    +']}'
   +']}';
   alert(JSON.stringify(JSON.parse(example), null, '  '));
  }
  
  /* ##########  POLYGON BUILDER  ########## */
  polygon_builder(tile)
  {tsai.action_prerender('polygon', tile, true);
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   var div=document.getElementById('tile_polygon');
   div.style.display='';
   div.style.top=0;
   div.style.left=0;
   var div_position=tsai.element_position(div);
   var tile_label=document.getElementById('tile_'+tile+'_polygon').nextElementSibling;
   var tile_position=tsai.element_position(tile_label);
   div.style.top=(tile_position.top-div_position.top+tile_label.offsetHeight+3)+'px';
   div.style.left=Math.max(10, tile_position.left+tile_label.getBoundingClientRect().width-div.getBoundingClientRect().left-div.getBoundingClientRect().width)+'px';
  }
  
  polygon_close()
  {document.getElementById('tile_polygon').style.display='none';
  }
  
  polygon_file_revert()
  {if(!tsai.menus_close()) return;
   if(!confirm('Revert tiles to before importing polygons?')) return;
   tsai.action_clear(true);
   tsai.scratch.polygon=[];
   tsai.tiles=JSON.parse(tsai.scratch.polygons_revert);
   document.getElementById('tiles').innerHTML='';
   tsai.tiles_write(0);
   tsai.action_clear(true);
   tsai.json_summary(false);
  }
  
  polygon_file_load(input)
  {var file=input.files[0];
   var extension=file.name.substring(file.name.lastIndexOf('.'));
   if(extension=='.json')
   {(async () =>
     {const file_text=await file.text();
      tsai.scratch.polygons=[];
      var json=JSON.parse(file_text);
      if('polygons' in json)
      {tsai.scratch.polygons=json.polygons;
       document.getElementById('tile_polygon_build_retain').style.display='';
       document.getElementById('tile_polygon_build_replace').style.display='';
    }}) ();
  }}
  
  polygon_file_import(replace)
  {tsai.scratch.polygons_revert=JSON.stringify(tsai.tiles.filter(function(value, index) {return document.getElementById('tile_'+index).style.display!='none';}));
   for(var polygon=0; polygon<tsai.scratch.polygons.length; polygon++)
   {var tile=tsai.tiles.length;
    tsai.scratch.polygon=tsai.scratch.polygons[polygon].coordinates;
    tsai.polygon_tile();
    if('name' in tsai.scratch.polygons[polygon])
    {tsai.tiles[tile].fov.name=tsai.scratch.polygons[polygon].name;
     document.getElementById('tile_'+tile+'_name').value=tsai.scratch.polygons[polygon].name;
   }}
   document.getElementById('tile_polygon_file').value='';
   document.getElementById('tile_'+tsai.action.item+'_polygon').checked=false;
   tsai.action_clear(true);
   tsai.action.mouse_down={};
   tsai.scratch.polygon=[];
   tsai.tma.points=0;
   tsai.menus_close();
   document.getElementById('tile_polygon_build_retain').style.display='none';
   document.getElementById('tile_polygon_build_replace').style.display='none';
   document.getElementById('tile_polygon_revert').style.display='';
   if(replace) tsai.tile_delete(tsai.action.item, false);
  }
  
  /* ##########  POLYGON ACTION  ########## */
  polygon_action(type, event, position)
  {var color=tsai.canvas.line_colors[tsai.tiles.length%tsai.canvas.line_colors.length][0];
   switch(type)
   {/* ##########  MOUSEMOVE  ########## */
    case 'mousemove':
     if(tsai.scratch.polygon.length>0)
     {tsai.draw_clear(tsai.canvas.draw_context);
      tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
      tsai.draw_line(tsai.canvas.draw_context, tsai.scratch.polygon[tsai.scratch.polygon.length-1], position, color, tsai.canvas.line_thickness);
     }
     break;
    case 'mouseup':
     if(tsai.scratch.polygon.length==0)
     {tsai.scratch.polygon.push({x: position.x, y: position.y}); // use {x: position.x, y: position.y} because behavior of pointer to position uncertain
      tsai.draw_clear(tsai.canvas.draw_context);
      tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
      tsai.canvas.draw_context.beginPath();
      tsai.canvas.draw_context.arc(position.x-tsai.image.crop, position.y, tsai.canvas.line_circle, 0, 2*Math.PI);
      tsai.canvas.draw_context.lineWidth=tsai.canvas.line_thickness;
      tsai.canvas.draw_context.lineCap='round';
      tsai.canvas.draw_context.strokeStyle=color;
      tsai.canvas.draw_context.stroke();
      tsai.draw_clear(tsai.canvas.prerender_context);
      tsai.canvas.prerender_context.drawImage(tsai.canvas.draw, 0, 0);
     }
     else if(Math.pow(Math.abs(position.x-tsai.scratch.polygon[0].x), 2)+Math.pow(position.y-Math.abs(tsai.scratch.polygon[0].y), 2)>Math.pow(tsai.canvas.line_circle, 2)) // outside radius of first point
     {if(tsai.scratch.polygon[tsai.scratch.polygon.length-1].x!=position.x && tsai.scratch.polygon[tsai.scratch.polygon.length-1].y!=position.y)
      {tsai.scratch.polygon.push({x: position.x, y: position.y}); // use {x: position.x, y: position.y} because behavior of pointer to position uncertain
       tsai.draw_clear(tsai.canvas.draw_context);
       tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
       tsai.draw_line(tsai.canvas.draw_context, tsai.scratch.polygon[tsai.scratch.polygon.length-2], tsai.scratch.polygon[tsai.scratch.polygon.length-1], color, tsai.canvas.line_thickness);
       tsai.draw_clear(tsai.canvas.prerender_context);
       tsai.canvas.prerender_context.drawImage(tsai.canvas.draw, 0, 0);
     }}
     else tsai.polygon_tile();
     break;
    case 'dblclick':
     tsai.scratch.polygon.push({x: position.x, y: position.y}); // use {x: position.x, y: position.y} because behavior of pointer to position uncertain
     if(tsai.scratch.polygon.length>0) tsai.polygon_tile();
     break;
    case 'mouseout':
     tsai.scratch.polygon=[];
     tsai.draw_reset();
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
    case 'mouseover':
     tsai.action_prerender('polygon', tsai.action.item, true);
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
  }}
  
  polygon_in(point, vertices)
  {var x=point[0];
   var y=point[1];
   var inside=false;
   var vertices_length=vertices.length;
   for(var i=0, j=vertices_length-1; i<vertices_length; j=i++)
   {var xi=vertices[i][0];
    var yi=vertices[i][1];
    var xj=vertices[j][0];
    var yj=vertices[j][1];
    var intersect=((yi>y)!=(yj>y)) && (x<(xj-xi)*(y-yi)/(yj-yi)+xi);
    // var intersect=((yi>=y)!=(yj>=y)) && (x<=(xj-xi)*(y-yi)/(yj-yi)+xi);
    if(intersect) inside=!inside;
   }
   return inside;
  }
  
  // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
  polygon_intersect_line(a, b, c, d, p, q, r, s)
  {var g;
   var l;
   var t=(c-a)*(s-q)-(r-p)*(d-b);
   if(t===0) return false;
   else
   {l=((s-q)*(r-a)+(p-r)*(s-b))/t;
    g=((b-d)*(r-a)+(c-a)*(s-b))/t;
    return (0<l && l<1) && (0<g && g<1);
  }}
  
  polygon_intersects(x, y, fov_half, vertices_plus)
  {var box=[[x-fov_half, y-fov_half], [x+fov_half, y-fov_half], [x+fov_half, y+fov_half], [x-fov_half, y+fov_half], [x-fov_half, y-fov_half]];
   var box_length_minus_1=box.length-1;
   var vertices_plus_length_minus_1=vertices_plus.length-1;
   for(var i=0; i<vertices_plus_length_minus_1; i++)
   {for(var j=0; j<box_length_minus_1; j++)
    {if(tsai.polygon_intersect_line(vertices_plus[i][0], vertices_plus[i][1], vertices_plus[i+1][0], vertices_plus[i+1][1], box[j][0], box[j][1], box[j+1][0], box[j+1][1])) return true;
   }}
   return false;
  }
  
  polygon_tile()
  {tsai.scratch.polygon.push({x: tsai.scratch.polygon[0].x, y: tsai.scratch.polygon[0].y});
   var minimum=tsai.coregistration_to_micron(tsai.image.transform, tsai.scratch.polygon[0]);
   var maximum=tsai.coregistration_to_micron(tsai.image.transform, tsai.scratch.polygon[0]);
   var scratch_polygon_length_minus_1=tsai.scratch.polygon.length-1;
   for(var index=1; index<scratch_polygon_length_minus_1; index++)
   {var micron=tsai.coregistration_to_micron(tsai.image.transform, tsai.scratch.polygon[index]);
    if(minimum.x>micron.x) minimum.x=micron.x;
    if(maximum.x<micron.x) maximum.x=micron.x;
    if(minimum.y>micron.y) minimum.y=micron.y;
    if(maximum.y<micron.y) maximum.y=micron.y;
   }
   minimum=tsai.coregistration_from_micron(tsai.image.transform, minimum);
   maximum=tsai.coregistration_from_micron(tsai.image.transform, maximum);
   // doing conversion and conversion back because cannot assume that optical coordinate minimum always corresponds to micron coordinate minimum
   tsai.duplicate_tile(tsai.action.item, minimum, maximum);
   var vertices=[];
   var scratch_polygon_length=scratch_polygon_length_minus_1+1;
   for(var index=0; index<scratch_polygon_length; index++)
   {var vertex=tsai.coregistration_to_micron(tsai.image.transform, tsai.scratch.polygon[index]);
    vertices.push([vertex.x, vertex.y]);
   }
   var vertices_plus=tsai.copy_array(vertices);
   if(vertices_plus.length>2) vertices_plus.push(vertices_plus[0]); // used in loop to look for line intersections
   var tile=tsai.tiles.length-1;
   var fov=tsai.tiles[tile].fov.fovSizeMicrons;
   var fov_half=fov/2;
   var x_origin=tsai.tiles[tile].fov.centerPointMicrons.x;
   var y_origin=tsai.tiles[tile].fov.centerPointMicrons.y;
   tsai.tile_map_resize(tile);
   var rows=tsai.tiles[tile].map.length;
   var columns=tsai.tiles[tile].map[0].length;
   for(var row=0; row<rows; row++)
   {for(var column=0; column<columns; column++)
    {var x=x_origin+(fov*column);
     var y=y_origin-(fov*row   );
     if(tsai.polygon_in([x, y], vertices) || tsai.polygon_intersects(x, y, fov_half, vertices_plus))
     {tsai.tiles[tile].map[row][column]=1;
      document.getElementById('tile_'+tile+'_map_'+row+'_'+column).checked=true;
     }
     else
     {tsai.tiles[tile].map[row][column]=0;
      document.getElementById('tile_'+tile+'_map_'+row+'_'+column).checked=false;
   }}}
   tsai.action.mouse_down={};
   tsai.scratch.polygon=[];
   tsai.tiles_draw(tsai.canvas.draw_context, []);
   tsai.draw_clear(tsai.canvas.prerender.context);
   tsai.canvas.prerender_context.drawImage(tsai.canvas.draw, 0, 0);
   tsai.tiles[tile].fov.name='';
   tsai.tiles[tile].original={fov: JSON.stringify(tsai.tiles[tile].fov), map: JSON.stringify(tsai.tiles[tile].map)};
   tsai.tile_expand(tile);
   document.getElementById('tile_'+tile+'_name').value='';
   document.getElementById('tile_'+tile+'_name').focus();
  }
  
  /* ###########################
     ##########  TMA  ##########
     ########################### */
  draw_tma_crosshair()
  {var crosshair=parseFloat(document.getElementById('slide_tma_crosshair').value.replace(/[^0-9\.]/g,''));
   if(isNaN(crosshair)) document.getElementById('slide_tma_crosshair').value=tsai.tma.crosshair;
   else if(crosshair!=tsai.tma.crosshair)
   {if(crosshair<1) crosshair=1;
    tsai.tma.crosshair=crosshair;
    document.getElementById('slide_tma_crosshair').value=crosshair;
    tsai.draw_reset();
    tsai.draw_cursor();
  }}
  
  draw_tma_crosshair_crement(increment)
  {document.getElementById('slide_tma_crosshair').value=tsai.tma.crosshair+increment;
   tsai.draw_tma_crosshair();
  }
  
  tma_builder(tile)
  {if(!this.menus_close('tma')) return;
   tsai.action_prerender('tma', tile, true);
   tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   var div=document.getElementById('tile_tma');
   div.style.display='';
   div.style.top=0;
   div.style.left=0;
   var div_position=tsai.element_position(div);
   var tile_label=document.getElementById('tile_'+tile+'_tma').nextElementSibling;
   var tile_position=tsai.element_position(tile_label);
   div.style.top=(tile_position.top-div_position.top+tile_label.offsetHeight+3)+'px';
   div.style.left=Math.max(10, tile_position.left+tile_label.getBoundingClientRect().width-div.getBoundingClientRect().left-div.getBoundingClientRect().width)+'px';
  }
  
  tma_resize(input, dimension)
  {var value=parseInt(input.value);
   if(isNaN(value)) input.value=(dimension==0?tsai.tma.rows:tsai.tma.columns);
   else
   {value=Math.max(1, value);
    input.value=value;
    if(dimension==0) tsai.tma.rows   =value;
    else             tsai.tma.columns=value;
    if(tsai.tma.points==4) tsai.tma_draw(true);
  }}
  
  tma_crement(row_crement, column_crement)
  {tsai.tma.rows   =Math.max(1, tsai.tma.rows   +row_crement   );
   tsai.tma.columns=Math.max(1, tsai.tma.columns+column_crement);
   document.getElementById('tile_tma_rows'   ).value=tsai.tma.rows;
   document.getElementById('tile_tma_columns').value=tsai.tma.columns;
   if(tsai.tma.points==4) tsai.tma_draw(true);
  }
  
  tma_name_rc(input, dimension)
  {var value=parseInt(input.value);
   if(isNaN(value)) input.value=(dimension==0?tsai.tma.row_start:tsai.tma.column_start);
   else
   {value=Math.max(1, value);
    input.value=value;
    if(dimension==0) tsai.tma.row_start   =value;
    else             tsai.tma.column_start=value;
  }}
  
  tma_close()
  {// returns true if the tma menu is not open or upon being closed
   // returns false if the tma menu persists because the user canceled closure
   if(tsai.action.type=='tma' && tsai.scratch.polygon.length>=4)
   {if(!confirm('Discard TMA points?')) return false;
    tsai.tma.points=0;
    tsai.scratch.polygon=[];
    tsai.tiles_draw(tsai.canvas.draw_context, []);
   }
   document.getElementById('tile_tma').style.display='none';
   return true;
  }
  
  tma_revert()
  {if(!tsai.menus_close()) return;
   if(!confirm('Revert tiles to before the last TMA?')) return;
   tsai.action_clear(true);
   tsai.scratch.polygon=[];
   tsai.tiles=JSON.parse(tsai.tma.revert);
   document.getElementById('tiles').innerHTML='';
   tsai.tiles_write(0);
   tsai.action_clear(true);
   tsai.json_summary(false);
  }
  
  tma_order(value)
  {tsai.tma.order=value;
   if(tsai.tma.points==4)
   {tsai.tma.corners=[0, 0, 0, 0, 0, 0, 0, 0];
    for(var corner=0; corner<4; corner++)
    {tsai.tma.corners[ tsai.tma.orders[tsai.tma.order][corner]*2   ]=tsai.scratch.polygon[corner].x;
     tsai.tma.corners[(tsai.tma.orders[tsai.tma.order][corner]*2)+1]=tsai.scratch.polygon[corner].y;
    }
    tsai.tma_draw(true);
  }}
  
  tma_action(type, event, position)
  {switch(type)
   {case 'mousemove':
     var position_adjusted={x: position.x, y: position.y};
     if(tsai.tma.points>=4) // corners set
     {if(tsai.tma.corner_adjust!=-1) // dragging corners
      {position_adjusted.x+=tsai.tma.corner_start.x-tsai.action.mouse_down.x;
       position_adjusted.y+=tsai.tma.corner_start.y-tsai.action.mouse_down.y;
       tsai.scratch.polygon[tsai.tma.corner_adjust]=position_adjusted;
       tsai.tma.corners[ tsai.tma.orders[tsai.tma.order][tsai.tma.corner_adjust]*2   ]=position_adjusted.x;
       tsai.tma.corners[(tsai.tma.orders[tsai.tma.order][tsai.tma.corner_adjust]*2)+1]=position_adjusted.y;
       tsai.draw_clear(tsai.canvas.draw_context);
       tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
       tsai.tma_draw(false);
     }}
     else if(tsai.tma.points>0)
     {tsai.scratch.polygon[tsai.tma.points]=position_adjusted;
      tsai.tma.corners[ tsai.tma.orders[tsai.tma.order][tsai.tma.points]*2   ]=position_adjusted.x;
      tsai.tma.corners[(tsai.tma.orders[tsai.tma.order][tsai.tma.points]*2)+1]=position_adjusted.y;
      tsai.draw_clear(tsai.canvas.draw_context);
      tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
      tsai.tma_draw(false);
     }
     break;
    case 'mouseup':
     if(tsai.tma.points<4)
     {tsai.scratch.polygon[tsai.tma.points  ]={x: position.x, y: position.y};
      tsai.scratch.polygon[tsai.tma.points+1]={x: position.x, y: position.y};
      tsai.tma.corners[ tsai.tma.orders[tsai.tma.order][tsai.tma.points]*2   ]=position.x;
      tsai.tma.corners[(tsai.tma.orders[tsai.tma.order][tsai.tma.points]*2)+1]=position.y;
      tsai.tma.points++;
      if(tsai.tma.points<4)
      {tsai.draw_clear(tsai.canvas.draw_context);
       tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
       tsai.tma_draw(false);
     }}
     if(tsai.tma.points>=4)
     {document.getElementById('tile_tma_build_retain').style.display='';
      document.getElementById('tile_tma_build_replace').style.display='';
      tsai.tma_draw(true);
     }
     tsai.tma.corner_adjust=-1;
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
    case 'mousedown':
     if(tsai.tma.points==4) // corners_set
     {var corner_closest=-1;
      var corner_closest_distance2=Math.pow(tsai.canvas.line_circle, 2);
      for(var corner=0; corner<4; corner++)
      {var distance2=Math.pow(position.x-tsai.scratch.polygon[corner].x, 2)+Math.pow(position.y-tsai.scratch.polygon[corner].y, 2);
       if(distance2<=corner_closest_distance2)
       {corner_closest_distance2=distance2;
        corner_closest=corner;
      }}
      if(corner_closest!=-1) // corners set, within corner radius
      {tsai.tma.corner_adjust=corner_closest;
       tsai.tma.corner_start={x: tsai.scratch.polygon[corner_closest].x, y: tsai.scratch.polygon[corner_closest].y};
       tsai.canvas.draw.style.cursor='none';
      }
      else // corners set, mouse_down outside corner radius
      {tsai.tma.corner_adjust=-1;
       tsai.canvas.draw.style.cursor='var(--crosshair)';
     }}
     break;
    case 'mouseout':
     if(tsai.tma.points<4)
     {tsai.tma.points=0;
      tsai.scratch.polygon=[];
      tsai.tiles_draw(tsai.canvas.draw_context, []);
     }
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
    case 'mouseover':
     tsai.action_prerender('tma', tsai.action.item, true);
     tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
  }}
  
  tma_draw(circles) // draws lines if corners<4, draws full polygon with crosshairs if corners==4
  {tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.drawImage(tsai.canvas.prerender, 0, 0);
   tsai.canvas.draw_context.globalAlpha=tsai.tma.line_opacity;
   var color=tsai.canvas.line_colors[tsai.tiles.length%tsai.canvas.line_colors.length][0];
   for(var corner=0; corner<tsai.tma.points && corner<3; corner++) tsai.draw_line(tsai.canvas.draw_context, tsai.scratch.polygon[corner], tsai.scratch.polygon[corner+1], color, tsai.canvas.line_thickness);
   if(tsai.tma.points>=3)
   {if(Math.pow(tsai.scratch.polygon[3].x-tsai.scratch.polygon[2].x, 2)+Math.pow(tsai.scratch.polygon[3].y-tsai.scratch.polygon[2].y, 2)>=Math.pow(tsai.canvas.line_circle, 2))
    {tsai.draw_line(tsai.canvas.draw_context, tsai.scratch.polygon[3], tsai.scratch.polygon[0], color, tsai.canvas.line_thickness);
     var tma_perspective=tsai.matrix_perspective([0, 0, Math.max(1, tsai.tma.columns-1), 0, Math.max(1, tsai.tma.columns-1), Math.max(1, tsai.tma.rows-1), 0, Math.max(1, tsai.tma.rows-1)], tsai.tma.corners, false);
     var row_max=Math.max(2, tsai.tma.rows)-1;
     var column_max=Math.max(2, tsai.tma.columns)-1;
     for(var row=0; row<=row_max; row++)
     {for(var column=0; column<=column_max; column++)
      {if((row==0 && column==0) || (row==0 && column==column_max) || (row==row_max && column==0) || (row==row_max && column==column_max)) continue;
       var centroid=tsai.matrix_perspective_transform(tma_perspective, {x: column, y: row});
       tsai.draw_line(tsai.canvas.draw_context, {x: centroid.x-tsai.tma.crosshair, y: centroid.y-tsai.tma.crosshair}, {x: centroid.x+tsai.tma.crosshair, y: centroid.y+tsai.tma.crosshair}, color, tsai.canvas.line_thickness);
       tsai.draw_line(tsai.canvas.draw_context, {x: centroid.x+tsai.tma.crosshair, y: centroid.y-tsai.tma.crosshair}, {x: centroid.x-tsai.tma.crosshair, y: centroid.y+tsai.tma.crosshair}, color, tsai.canvas.line_thickness);
     }}
   }}
   if(circles && tsai.tma.points>=4)
   {for(var corner=0; corner<4; corner++)
    {tsai.canvas.draw_context.beginPath();
     tsai.canvas.draw_context.arc(tsai.scratch.polygon[corner].x-tsai.image.crop, tsai.scratch.polygon[corner].y, tsai.canvas.line_circle, 0, 2*Math.PI);
     tsai.canvas.draw_context.lineWidth=tsai.canvas.line_thickness;
     tsai.canvas.draw_context.lineCap='round';
     tsai.canvas.draw_context.strokeStyle=color;
     tsai.canvas.draw_context.stroke();
   }}
   tsai.canvas.draw_context.globalAlpha=1;
  }
  
  tma_prepend(event)
  {if(String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) document.getElementById('tile_tma_prepend').checked=true;
  }
  
  tma_build(replace)
  {tsai.tma.revert=JSON.stringify(tsai.tiles.filter(function(value, index) {return document.getElementById('tile_'+index).style.display!='none';}));
   var label_prepend=(document.getElementById('tile_tma_prepend').checked?document.getElementById('tile_tma_prepend_text').value.replace(/_+\s*$/, '_'):'');
   var label_row_column=document.getElementById('tile_tma_name_rc').checked || document.getElementById('tile_tma_name_rcm').checked;
   var label_map=document.getElementById('tile_tma_name_map').checked || document.getElementById('tile_tma_name_rcm').checked;
   var tile_string=JSON.stringify(tsai.tiles[tsai.action.item]);
   var tile_map=JSON.stringify(tsai.tiles[tsai.action.item].map);
   var target_offset_x=0;
   var target_offset_y=0;
   if(document.getElementById('tile_tma_target_tile').checked)
   {target_offset_x=tsai.tiles[tsai.action.item].fov.fovSizeMicrons*(tsai.tiles[tsai.action.item].map[0].length-1)/2;
    target_offset_y=tsai.tiles[tsai.action.item].fov.fovSizeMicrons*(tsai.tiles[tsai.action.item].map.length-1)/2;
   }
   var start=tsai.tiles.length;
   var tma_perspective=tsai.matrix_perspective([0, 0, Math.max(1, tsai.tma.columns-1), 0, Math.max(1, tsai.tma.columns-1), Math.max(1, tsai.tma.rows-1), 0, Math.max(1, tsai.tma.rows-1)], tsai.tma.corners, false);
   for(var row=0; row<tsai.tma.rows; row++)
   {for(var column=0; column<tsai.tma.columns; column++)
    {var tile=tsai.action.item;
     if(replace && row==0 && column==0) tsai.tiles[tile]=JSON.parse(tile_string);
     else tile=tsai.tiles.push(JSON.parse(tile_string))-1;
     if(label_map)
     {if(tsai.tma.labels.length<=row || tsai.tma.labels[row].length <=column ||  tsai.tma.labels[row][column].trim()=='') tsai.tiles[tile].fov.name=label_prepend+'R'+(tsai.tma.row_start+row)+'C'+(tsai.tma.column_start+column);
      else if(label_row_column) tsai.tiles[tile].fov.name=label_prepend+'R'+(tsai.tma.row_start+row)+'C'+(tsai.tma.column_start+column)+' '+tsai.tma.labels[row][column].trim();
      else tsai.tiles[tile].fov.name=label_prepend+tsai.tma.labels[row][column].trim();
     }
     else tsai.tiles[tile].fov.name=label_prepend+'R'+(tsai.tma.row_start+row)+'C'+(tsai.tma.column_start+column);
     if(replace && row==0 && column==0) document.getElementById('tile_'+tile+'_name').value=tsai.tiles[tile].fov.name;
     var centroid=tsai.coregistration_to_micron(tsai.image.transform, tsai.matrix_perspective_transform(tma_perspective, {x: column, y: row}));
     tsai.tiles[tile].fov.centerPointMicrons.x=Math.round(centroid.x-target_offset_x);
     tsai.tiles[tile].fov.centerPointMicrons.y=Math.round(centroid.y+target_offset_y);
     tsai.tiles[tile].original={fov: JSON.stringify(tsai.tiles[tile].fov), map: tile_map};
   }}
   tsai.tiles_write(start);
   tsai.action.mouse_down={};
   tsai.scratch.polygon=[];
   tsai.tma.points=0;
   tsai.menus_close();
   document.getElementById('tile_tma_build_retain').style.display='none';
   document.getElementById('tile_tma_build_replace').style.display='none';
   document.getElementById('tile_tma_revert').style.display='';
  }
  
  /* ############################
     ##########  COPY  ##########
     ############################ */
  copy_close()
  {document.getElementById('tile_copy').style.display='none';
   return true;
  }
  
  copy_menu(tile)
  {if(!this.menus_close('copy')) return;
   tsai.action.type='copy';
   tsai.action.item=tile;
   var count=0;
   var items='';
   var b='\n<li><span onclick="tsai.copy_menu_all(true);">Select all</span>'
    +'\n<li><span onclick="tsai.copy_menu_all(false);">Select none</span>';
   for(var item=0; item<tsai.tiles.length; item++)
   {if(item==tile || !tsai.tiles[item].active) continue;
    b+='\n<li><input id="tile_copy_'+item+'" type="checkbox"/><label for="tile_copy_'+item+'"> '+(tsai.tiles[item].fov.name.trim()==''?'Tile '+item:tsai.tiles[item].fov.name)+'</label>';
    items+=','+item;
    count++;
   }
   if(count<=1) tsai.copy_close();
   else
   {document.getElementById('tile_copy_items').value=items.substring(1);
    document.getElementById('tile_copy_list').innerHTML=b;
    var div=document.getElementById('tile_copy');
    div.style.display='';
    div.style.top=0;
    div.style.left=0;
    var div_position=tsai.element_position(div);
    var tile_label=document.getElementById('tile_'+tile+'_copy').nextElementSibling;
    var tile_position=tsai.element_position(tile_label);
    div.style.top=(tile_position.top-div_position.top+tile_label.offsetHeight+3)+'px';
    div.style.left=Math.max(10, tile_position.left+tile_label.getBoundingClientRect().width-div.getBoundingClientRect().left-div.getBoundingClientRect().width)+'px';
  }}
  
  copy_menu_all(bool)
  {var items=document.getElementById('tile_copy_items').value.split(',');
   for(var item=0; item<items.length; item++)
   {var tile=parseInt(items[item]);
    if('standardTarget' in tsai.tiles[tile].fov && tsai.tiles[tile].fov.standardTarget=='Molybdenum Foil') continue;
    if(document.getElementById('tile_copy_'+tile)) document.getElementById('tile_copy_'+tile).checked=bool;
  }}
  
  copy_paste()
  {var template=tsai.action.item;
   var items=document.getElementById('tile_copy_items').value.split(',');
   for(var item=0; item<items.length; item++)
   {var tile=parseInt(items[item]);
    if(tsai.tiles[item].active && document.getElementById('tile_copy_'+tile).checked)
    {// FOV, raster, preset, dwell
     document.getElementById('tile_'+tile+'_fov'   ).value=document.getElementById('tile_'+template+'_fov'   ).value;
     document.getElementById('tile_'+tile+'_raster').value=document.getElementById('tile_'+template+'_raster').value;
     document.getElementById('tile_'+tile+'_preset').value=document.getElementById('tile_'+template+'_preset').value;
     document.getElementById('tile_'+tile+'_dwell' ).value=document.getElementById('tile_'+template+'_dwell' ).value;
     document.getElementById('tile_'+tile+'_depth' ).value=document.getElementById('tile_'+template+'_depth' ).value;
     tsai.tile_fov(tile);
     tsai.tile_raster(tile);
     tsai.tile_preset(tile);
     tsai.tile_dwell(tile);
     tsai.tile_depth(tile);
   }}
   tsai.copy_close();
  }
  
  
  /* ##########################################
     ##########################################
     ##########                      ##########
     ##########   IMPORT FUNCTIONS   ##########
     ##########                      ##########
     ##########################################
     ########################################## */
  
  import_sort(file)
  {var extension=file.name.substring(file.name.lastIndexOf('.'));
   if(extension=='.json')
   {document.getElementById('import_json').innerHTML=file.name;
    document.getElementById('import_json').style.display='';
    tsai.import_read(file);
   }
   else if(['.png', '.bmp', '.jpg', '.jpeg'].includes(extension))
   {document.getElementById('import_image').innerHTML=file.name;
    document.getElementById('import_image').style.display='';
    tsai.images.import.coordinates=tsai.images.optical.coordinates;
    tsai.image_load('import', file, tsai.canvas.optical_crop);
  }}
  
  import_read(file)
  {(async () =>
    {const file_text=await file.text();
     tsai.scratch.tiles=tsai.json_load(file_text, tsai.import_errors);
     if(tsai.scratch.tiles.length>0)
     {var options='\n<option value=""></option>';
      var scratch_tiles_length=tsai.scratch.tiles.length;
      for(var tile=0; tile<scratch_tiles_length; tile++) options+='\n<option value="'+tsai.scratch.tiles[tile].fov.centerPointMicrons.x+','+tsai.scratch.tiles[tile].fov.centerPointMicrons.y+'">'+tsai.scratch.tiles[tile].fov.name+'</option>';
      for(var index=0; index<4; index++) document.getElementById('import_coordinates_'+index+'_select').innerHTML=options;
   }}) ();
  }
  
  import_errors(errors)
  {if(errors!='')
   {var innerhtml=document.getElementById('import_errors').innerHTML;
    var index=innerhtml.lastIndexOf('</li>');
    if(index==-1) document.getElementById('import_errors').innerHTML='\n<div class="_layout_warnings">\n<h2>Errors</h2>\n<ul>'+errors.trim()+'</ul>\n<p><a href="javascript:tsai.import_errors_clear();">Clear errors\n</a>\n</p>\n</div>\n';
    else document.getElementById('import_errors').innerHTML=innerhtml.substring(0, index)+'\n'+errors.trim()+innerhtml.substring(index);
  }}
  
  import_errors_clear()
  {document.getElementById('import_errors').innerHTML='';
  }
  
  import_coordinates_draw(from_into)
  {tsai.draw_clear(tsai.canvas.draw_context);
   tsai.canvas.draw_context.globalAlpha=tsai.coordinates.line_opacity;
   for(var index=0; index<4; index++)
   {var x=tsai.coordinates.import[index][from_into*2];
    var y=tsai.coordinates.import[index][from_into*2+1];
    if(isNaN(x) || isNaN(y) || typeof x=='string' || typeof y=='string') continue;
    var micron=tsai.coregistration_from_micron(tsai.image.transform, {x: x, y: y});
    tsai.draw_line(tsai.canvas.draw_context, {x: micron.x-tsai.coordinates.crosshair, y: micron.y}, {x: micron.x+tsai.coordinates.crosshair, y: micron.y}, tsai.coordinates.line_colors[index][0], tsai.coordinates.line_thickness);
    tsai.draw_line(tsai.canvas.draw_context, {x: micron.x, y: micron.y-tsai.coordinates.crosshair}, {x: micron.x, y: micron.y+tsai.coordinates.crosshair}, tsai.coordinates.line_colors[index][0], tsai.coordinates.line_thickness);
   }
   tsai.canvas.draw_context.globalAlpha=1;
  }
  
  import_coordinates(selected, from_into) // set up import_action
  {for(var axis=0; axis<2; axis++)
   {var value=parseFloat(document.getElementById('import_coordinates_'+selected+'_'+from_into+'_'+['x', 'y'][axis]).value);
    if(!isNaN(value)) tsai.coordinates.import[selected][2*from_into+axis]=value;
   }
   document.getElementById('import_coordinates_'+selected+'_'+from_into).checked=true;
   if(from_into==0)
   {// match coordinates to selectedIndex
    document.getElementById('import_coordinates_'+selected+'_select').selectedIndex=0;
    var x=parseFloat(document.getElementById('import_coordinates_'+selected+'_0_x').value);
    var y=parseFloat(document.getElementById('import_coordinates_'+selected+'_0_y').value);
    var scratch_tiles_length=tsai.scratch.tiles.length;
    for(var tile=0; tile<scratch_tiles_length; tile++)
    {if(x==parseInt(tsai.scratch.tiles[tile].fov.centerPointMicrons.x*1000)/1000 && y==parseInt(tsai.scratch.tiles[tile].fov.centerPointMicrons.y*1000)/1000)
     {document.getElementById('import_coordinates_'+selected+'_select').selectedIndex=(tile+1);
      break;
   }}}
   if(!tsai.menus_close()) return false;
   tsai.action.type='import';
   tsai.action.item=[selected, from_into];
   var scale=1;
   if(tsai.images.optical.loaded) scale=tsai.images.optical.scale;
   document.getElementById('slide_zoom').value=Math.round(scale*1000)/1000;
   if(tsai.images[['import', 'optical'][from_into]].loaded)
   {tsai.image_tab(['import', 'optical'][from_into], scale);
    tsai.import_coordinates_draw(tsai.action.item[1]);
  }}
  
  /* ##########  ACTION  ########## */
  import_action(type, event, position)
  {if(!tsai.menus_close()) return false;
   var selected=tsai.action.item[0];
   var from_into=tsai.action.item[1];
   var image=['import', 'optical'][from_into];
   if(!tsai.images[image].loaded) return;
   switch(type)
   {case 'mousemove': if(!tsai.action.mouse_dragged) break; // NO forced break; only continue to draw if mousedown and dragged
    case 'mouseup':
     var micron=tsai.coregistration_to_micron(tsai.image.transform, position);
     tsai.coordinates.import[selected][2*from_into  ]=micron.x;
     tsai.coordinates.import[selected][2*from_into+1]=micron.y;
     document.getElementById('import_coordinates_'+selected+'_'+from_into+'_x').value=micron.x;
     document.getElementById('import_coordinates_'+selected+'_'+from_into+'_y').value=micron.y;
     document.getElementById('import_coordinates_'+selected+'_select').selectedIndex=0;
     tsai.draw_clear(tsai.canvas.draw_context);
     tsai.import_coordinates_draw(from_into);
     if(type!='mousemove') tsai.canvas.draw.style.cursor='var(--crosshair)';
     break;
    case 'mouseover': tsai.canvas.draw.style.cursor='var(--crosshair)'; break;
    case 'mousedown': tsai.canvas.draw.style.cursor='none'; break;
    case 'keydown':
     if(document.activeElement.id.indexOf('import_coordinates_')!=0 && document.activeElement!=document.body) return;
     if(document.activeElement.tagName.toLowerCase()=='textarea' || (document.activeElement.tagName.toLowerCase()=='input' && document.activeElement.type=='text')) return;
     switch(event.code)
     {case 'KeyA':
       if(selected>0)
       {selected--;
        tsai.action.item[0]=selected;
        document.getElementById('import_coordinates_'+selected+'_'+from_into).checked=true;
       }
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'KeyD':
       if(selected<3)
       {selected++;
        tsai.action.item[0]=selected;
        document.getElementById('import_coordinates_'+selected+'_'+from_into).checked=true;
       }
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'ArrowUp': ; // NO break
      case 'ArrowDown':
       if(typeof tsai.coordinates.import[selected][2*from_into+1]=='string' || isNaN(tsai.coordinates.import[selected][2*from_into+1])) break;
       var nudge=tsai.coordinates.import[selected][2*from_into+1]+((event.shiftKey?tsai.action.nudge_shift:event.altKey?tsai.action.nudge_opt:tsai.action.nudge)*(event.code=='ArrowUp'?1:-1));
       tsai.coordinates.import[selected][2*from_into+1]=nudge;
       document.getElementById('import_coordinates_'+selected+'_'+from_into+'_y').value=nudge;
       document.getElementById('import_coordinates_'+selected+'_select').selectedIndex=0;
       tsai.draw_clear(tsai.canvas.draw_context);
       tsai.import_coordinates_draw(from_into);
       event.stopPropagation();
       event.preventDefault();
       break;
      case 'ArrowLeft': ; // NO break
      case 'ArrowRight':
       if(typeof tsai.coordinates.import[selected][2*from_into]=='string' || isNaN(tsai.coordinates.import[selected][2*from_into])) break;
       var nudge=tsai.coordinates.import[selected][2*from_into]+((event.shiftKey?tsai.action.nudge_shift:event.altKey?tsai.action.nudge_opt:tsai.action.nudge)*(event.code=='ArrowLeft'?-1:1));
       tsai.coordinates.import[selected][2*from_into]=nudge;
       document.getElementById('import_coordinates_'+selected+'_'+from_into+'_x').value=nudge;
       document.getElementById('import_coordinates_'+selected+'_select').selectedIndex=0;
       tsai.draw_clear(tsai.canvas.draw_context);
       tsai.import_coordinates_draw(from_into);
       event.stopPropagation();
       event.preventDefault();
       break;
     }
     break;
  }}
  
  import_identity()
  {var identity=[[0, 0], [1, 0], [0, 1], [1, 1]];
   for(var index=0; index<4; index++)
   {document.getElementById('import_coordinates_'+index+'_0_x').value=identity[index][0];
    document.getElementById('import_coordinates_'+index+'_0_y').value=identity[index][1];
    document.getElementById('import_coordinates_'+index+'_1_x').value=identity[index][0];
    document.getElementById('import_coordinates_'+index+'_1_y').value=identity[index][1];
  }}
  
  import_prepend(event)
  {if(String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) document.getElementById('import_prepend').checked=true;
  }
  
  import_coordinates_select(select, index)
  {var coordinate=['', ''];
   if(select.value!='') coordinate=select.value.split(',').map(function(element) {return parseFloat(element);});
   document.getElementById('import_coordinates_'+index+'_0_x').value=coordinate[0];
   document.getElementById('import_coordinates_'+index+'_0_y').value=coordinate[1];
   document.getElementById('import_coordinates_'+index+'_0').click();
  }
  
  import_build(append)
  {if(tsai.tiles.length        ==0) {tsai.import_errors('<li>A target JSON file must be loaded into which FOVs/tiles can be imported</li>'); return;}
   if(tsai.scratch.tiles.length==0) {tsai.import_errors('<li>A source JSON file must be loaded from which FOVs/tiles can be imported</li>'); return;}
   var from=[];
   var into=[];
   for(var index=0; index<4; index++)
   {from.push(tsai.coordinates.import[index][0]);
    from.push(tsai.coordinates.import[index][1]);
    into.push(tsai.coordinates.import[index][2]);
    into.push(tsai.coordinates.import[index][3]);
   }
   var identity=true;
   for(var index=0; index<8; index++)
   {if(isNaN(from[index]) || isNaN(into[index])) {tsai.import_errors('<li>Four pairs of coordinates are required</li>'); return;}
    if(from[index]!=into[index]) identity=false;
   }
   var start=0;
   if(!append) tsai.tiles=[];
   else start=tsai.tiles.length;
   var import_perspective=(identity?null:tsai.matrix_perspective(from, into, false));
   var prepend=(document.getElementById('import_prepend').checked?document.getElementById('import_prepend_text').value:'');
   var scratch_tiles_length=tsai.scratch.tiles.length;
   for(var tile=0; tile<scratch_tiles_length; tile++)
   {var index=tsai.tiles.length;
    tsai.tiles.push(JSON.parse(JSON.stringify(tsai.scratch.tiles[tile])));
    if(prepend!='') tsai.tiles[index].fov.name=prepend+tsai.tiles[index].fov.name;
    tsai.tiles[index].fov.slideId=tsai.json.slide_id; // accounts for case when imported json loaded before target json
    tsai.tiles[index].fov.sectionId=tsai.json.section_ids[0];
    if(!identity)
    {var coordinates=tsai.matrix_perspective_transform(import_perspective, {x: tsai.scratch.tiles[tile].fov.centerPointMicrons.x, y: tsai.scratch.tiles[tile].fov.centerPointMicrons.y});
     tsai.tiles[index].fov.centerPointMicrons.x=parseInt(coordinates.x);
     tsai.tiles[index].fov.centerPointMicrons.y=parseInt(coordinates.y);
   }}
   tsai.tiles_write(start);
   tsai.action_clear(true);
   tsai.image_tab('optical', 1);
   tsai.tiles_draw(tsai.canvas.draw_context, []);
  }
  
  /* ##################################################
     ##################################################
     ##########                              ##########
     ##########   FOV NAVIGATION FUNCTIONS   ##########
     ##########                              ##########
     ##################################################
     ################################################## */
  
  navigation_code_clear()
  {var b='';
   ['sed', 'map', 'fov'].forEach((variable)=>
    {b+='if(typeof '+variable+'_key!==\'undefined\') document.removeEventListener(\'keydown\', '+variable+'_key, false);'
      +' if(typeof '+variable+'!==\'undefined\') try {'+variable+'.exit();} catch(error) {'+variable+'=null;}'
   });
   return b;
  }
  
  navigation_code_arrows(size)
  {if(typeof size==undefined) size='';
   else
   {size=parseInt(size);
    var clear='';
    if(size==0 || isNaN(size)) clear='';
    else clear=' this.context.clearRect(0,0,'+size+','+size+');';
   }
   return 'case \'ArrowUp\':'   +clear+' document.getElementById(\'jogUpBy\'+(event.shiftKey?3:event.altKey?1:2)+\'Btn\').click(); break;' // use altKey instead of ctrlKey because ctrlKey+ArrowUp is Mission Control on MacOS
    +    ' case \'ArrowDown\':' +clear+' document.getElementById(\'jogDownBy\'+(event.shiftKey?3:event.altKey?1:2)+\'Btn\').click(); break;'
    +    ' case \'ArrowLeft\':' +clear+' document.getElementById(\'jogLeftBy\'+(event.shiftKey?3:event.altKey?1:2)+\'Btn\').click(); break;'
    +    ' case \'ArrowRight\':'+clear+' document.getElementById(\'jogRightBy\'+(event.shiftKey?3:event.altKey?1:2)+\'Btn\').click(); break;';
  }
  
  navigation_code_move()
  {return ''
    + ' magnification:'
    +  ' function()'
    +  ' {if(!document.getElementById(\'rangeMag\') && !document.getElementById(\'rangeFovSize\')) document.getElementById(\'sedImage-header\').children[0].click();'
    +   ' if(document.getElementById(\'rangeMag\')) return document.getElementById(\'rangeMag\');'
    +   ' if(document.getElementById(\'rangeFovSize\')) return document.getElementById(\'rangeFovSize\').children[0];'
    +   ' return null;'
    +   '},'
    + ' target_x:'
    +  ' function()'
    +  ' {if(document.getElementById(\'targetPosX\')) return document.getElementById(\'targetPosX\');'
    +   ' if(document.getElementById(\'inputOptTPX\')) return document.getElementById(\'inputOptTPX\');'
    +   ' return null;'
    +   '},'
    + ' target_y:'
    +  ' function()'
    +  ' {if(document.getElementById(\'targetPosY\')) return document.getElementById(\'targetPosY\');'
    +   ' if(document.getElementById(\'inputOptTPY\')) return document.getElementById(\'inputOptTPY\');'
    +   ' return null;'
    +   '},'
    + ' target_move:'
    +  ' function()'
    +  ' {if(document.getElementById(\'moveStageBtn\')) document.getElementById(\'moveStageBtn\').click();'
    +   ' else if(document.getElementById(\'inputOptTPY\')) document.getElementById(\'inputOptTPY\').nextElementSibling.click();'
    +   '},';
  }
  
  navigation_code_filter()
  {return ''
    + ' filter_brightness: 1,'
    + ' filter_contrast: 1,'
    + ' filter_crement:'
    +  ' function(brightness, contrast)'
    +  ' {this.filter_brightness+=brightness;'
    +   ' this.filter_contrast+=contrast;'
    +   ' this.filter.filter=\'brightness(\'+this.filter_brightness+\') contrast(\'+this.filter_contrast+\')\';'
    +   '},';
  }

  navigation_code_sed_save()
  {return ' sed:'
    +  ' function(name)'
    +  ' {if(this.canvas.width==0 || this.canvas.height==0) return;'
    +   ' var canvas=document.createElement(\'canvas\');'
    +   ' canvas.style=\'display:none;\';'
    +   ' canvas.width=this.canvas.width;'
    +   ' canvas.height=this.canvas.height;'
    +   ' document.body.appendChild(canvas);'
    +   ' canvas.getContext(\'2d\').drawImage(this.canvas, 0, 0);'
    +   ' canvas.getContext(\'2d\').drawImage(this.overlay, 0, 0);'
    +   ' canvas.toBlob('
    +    ' (blob)=>'
    +    ' {var url=window.URL || window.webkitURL;'
    +     ' var anchor=document.createElement(\'a\');'
    +     ' anchor.href=url.createObjectURL(blob);'
    +     ' anchor.download=name;'
    +     ' document.body.appendChild(anchor);'
    +     ' anchor.click();'
    +     ' document.body.removeChild(anchor);'
    +   '})},';
  }
  
  navigation_code_logger()
  {return ' logger:'
    +  ' function()'
    +  ' {if(document.getElementById(\'focus-header\'))'
    +   ' {if(!document.getElementById(\'inputNewFocus\')) document.getElementById(\'focus-header\').children[0].click();'
    +    ' this.log.focus=document.getElementById(\'inputNewFocus\').value;'
    +    ' if(!document.getElementById(\'stigmationAngle\')) document.getElementById(\'stigmation-header\').children[0].click();'
    +    ' this.log.stigmation_angle=document.getElementById(\'stigmationAngle\').value;'
    +    ' this.log.stigmation_magnitude=document.getElementById(\'stigmationMagnitude\').value;'
    +    '}'
    +   ' else if(document.getElementById(\'beamCurrent\'))'
    +   ' {var preset=document.getElementById(\'selectedImagingPreset\');'
    +    ' if(preset.options[preset.selectedIndex].text.toLowerCase().includes(\'coarse\'))'
    +    ' {this.log.fc_coarse=document.getElementById(\'beamCurrent\').value;'
    +     ' this.log.l1_coarse=document.getElementById(\'lens1V\').value;'
    +     '}'
    +    ' if(preset.options[preset.selectedIndex].text.match(/super\s*fine/i)!=-1)'
    +    ' {this.log.fc_superfine=document.getElementById(\'beamCurrent\').value;'
    +     ' this.log.l1_superfine=document.getElementById(\'lens1V\').value;'
    +    '}}'
    +   ' var slide_id=\'\';'
    +   ' if(document.getElementById(\'mibitracker-link\')) slide_id=document.getElementById(\'mibitracker-link\').innerHTML.replace(/^\\s*(<![\\s\\-]+>)?\\s*slide\\s*/i, \'\');'
    +   ' var time_estimate=\'\';'
    +   ' if(document.getElementById(\'fovEstimate\'))'
    +   ' {var day=document.getElementById(\'fovEstimate\').innerHTML.match(/(\\d+)\\s*day/);'
    +    ' if(day) time_estimate+=parseInt(day[1])+\'d\';'
    +    ' var hms=document.getElementById(\'fovEstimate\').innerHTML.match(/(\\d\\d?):(\\d\\d?):(\\d\\d?)/);'
    +    ' if(hms) time_estimate+=parseInt(hms[1])+\'h\'+Math.ceil(((parseInt(hms[2])*60)+parseInt(hms[3]))/60)+\'m\';'
    +    ' else'
    +    ' {hms=document.getElementById(\'fovEstimate\').innerHTML.match(/(\\d\\d?):(\\d\\d?)/);'
    +     ' if(hms) time_estimate+=parseInt(hms[1])+\'m\'+parseInt(hms[2])+\'s\';'
    +    '}}'
    +   ' console.log(\'\\nRun log entry:\''
    +     '+\'\\n\'+this.time().ymd+\'_\'+this.log.name'
    +     '+\'\\t\'+this.time().mdy'
    +     '+\'\\t\'+slide_id'
    +     '+\'\\t\'+(\'fc_coarse\' in this.log?this.log.fc_coarse:\'\')'
    +     '+\'\\t\'+(\'l1_coarse\' in this.log?this.log.l1_coarse:\'\')'
    +     '+\'\\t\'+(\'fc_superfine\' in this.log?this.log.fc_superfine:\'\')'
    +     '+\'\\t\'+(\'l1_superfine\' in this.log?this.log.l1_superfine:\'\')'
    +     '+\'\\t\\t\\t\''
    +     '+\'\\t\'+(\'focus\' in this.log?this.log.focus:\'\')'
    +     '+\'\\t\'+(\'stigmation_angle\' in this.log?this.log.stigmation_angle:\'\')'
    +     '+\'\\t\'+(\'stigmation_magnitude\' in this.log?this.log.stigmation_magnitude:\'\')'
    +     '+\'\\t\''
    +     '+\'\\t\'+time_estimate'
    +    ');'
    +   ' return \'\';'
    +   '},';
  }
  
  navigation_code()
  {var coordinates='';
   var tiles_length=tsai.tiles.length;
   for(var tile=0; tile<tiles_length; tile++)
   {if(tsai.tiles[tile].active)
    {if(tsai.tiles[tile].fov.name=='')
     {tsai.tiles[tile].fov.name='Tile_'+(tile+1);
      document.getElementById('tile_'+tile+'_name').value='Tile_'+(tile+1);
     }
     var fov=tsai.tiles[tile].fov.fovSizeMicrons;
     var x=Math.round(tsai.tiles[tile].fov.centerPointMicrons.x);
     var y=Math.round(tsai.tiles[tile].fov.centerPointMicrons.y);
     var rows=tsai.tiles[tile].map.length;
     var columns=tsai.tiles[tile].map[0].length;
     for(var row=0; row<rows; row++)
     {var x_row=x;
      for(var column=0; column<columns; column++)
      {if(tsai.tiles[tile].map[row][column]==1)
       {coordinates+='['+tile+',\''+tsai.tiles[tile].fov.name+'\',';
        if(rows>1 || columns>1) coordinates+='\'R'+(row+1)+'C'+(column+1)+'\'';
        else coordinates+='\'\'';
        coordinates+=''
         +','+(Math.round(x_row+fov*((row   *tsai.coregistration.shift.x_y)+(column*tsai.coregistration.shift.x_x)))/1000)
         +','+(Math.round(y    -fov*((column*tsai.coregistration.shift.y_x)+(row   *tsai.coregistration.shift.y_y)))/1000)+','+fov+'],';
        // on/off is pushed into the array later, along with copying to fov.original
       }
       x_row+=fov;
      }
      y-=fov;
   }}}
   coordinates=coordinates.slice(0,-1);
   // coordinates array [[0: tile index, 1: name, 2: R#C#, 3: x, 4: y, 5: FOV, 6: on/off], ...]
   var b=tsai.navigation_code_clear()
   +' if(typeof fov===\'undefined\' || fov===null)'
   +' {var fov='
    + '{current:['+coordinates+'],'
    + ' original:[],'
    + ' log: {name: \''+tsai.json.name.replaceAll('\'', '\\\'')+'\'},'
    + ' index:-1,'
    + ' canvas: document.getElementsByTagName(\'canvas\')[2],'
    + ' filter: document.getElementsByTagName(\'canvas\')[2].getContext(\'2d\'),'
    + ' overlay: document.getElementsByTagName(\'canvas\')[3],'
    + ' context: document.getElementsByTagName(\'canvas\')[3].getContext(\'2d\'),'
    + ' wait: function(milliseconds) {return new Promise(resolve=>{setTimeout(()=>{resolve(\'\')}, milliseconds);})},'
    +   tsai.navigation_code_move()
    +   tsai.navigation_code_filter()
    + ' move:'
    +  ' async function(current)' // current==true loads from this.current, current==false loads from this.original
    +  ' {if(this.index>=this.current.length) this.index=this.current.length-1;'
    +   ' else if(this.index<0) '          +'this.index=(this.current.length==0?-1:0);'
    +   ' if(!(this.index in this.current)) return \'\';'
    +   ' if(current)'
    +   ' {this.target_x().value=this.current[this.index][3];'
    +    ' this.target_x().dispatchEvent(new Event(\'change\'));'
    +    ' this.target_x().dispatchEvent(new Event(\'input\'));'
    +    ' await this.wait(100);'
    +    ' this.target_y().value=this.current[this.index][4];'
    +    ' this.target_y().dispatchEvent(new Event(\'change\'));'
    +    ' this.target_y().dispatchEvent(new Event(\'input\'));'
    +    ' await this.wait(100);'
    +    ' console.log(this.current[this.index][1]+(this.current[this.index][2]==\'\'?\'\':\' \'+this.current[this.index][2])+\' loaded at (\'+this.current[this.index][3]+\', \'+this.current[this.index][4]+\')\'+(this.index==this.current.length-1?\', last FOV\':\'\'));'
    +    '}'
    +   ' else'
    +   ' {this.target_x().value=this.original[this.index][3];'
    +    ' this.target_x().dispatchEvent(new Event(\'change\'));'
    +    ' this.target_x().dispatchEvent(new Event(\'input\'));'
    +    ' await this.wait(100);'
    +    ' this.target_y().value=this.original[this.index][4];'
    +    ' this.target_y().dispatchEvent(new Event(\'change\'));'
    +    ' this.target_y().dispatchEvent(new Event(\'input\'));'
    +    ' await this.wait(100);'
    +    ' console.log(this.current[this.index][1]+(this.current[this.index][2]==\'\'?\'\':\' \'+this.current[this.index][2])+\' rewound to (\'+this.original[this.index][3]+\', \'+this.original[this.index][4]+\')\');'
    +    '}'
    +   ' this.target_move();'
    +   '},'
    + ' first:'+' function() {this.check(true); this.index=0; this.move(true); return \'\';},'
    + ' last:' +' function() {this.check(true); this.index=this.current.length-1; this.move(true); return \'\';},'
    + ' next:' +' function() {this.check(true); this.index++; this.move(true); return \'\';},'
    + ' previous: function() {this.check(true); this.index--; this.move(true); return \'\';},'
    + ' goto:'
    + '  function()'
    +  ' {if(this.current.length==0) return \'\';'
    +   ' this.check();'
    +   ' var query=prompt(\'Index or search query, space- and case-insensitive:\');'
    +   ' if(query==null || query==\'\') return \'\';'
    +   ' query=query.toUpperCase().replace(/\s+/g, \'\');'
    +   ' var result=-1;'
    +   ' var maybe=-1;'
    +   ' if(/^[0-9]+$/.test(query)) result=parseInt(query);' // change to index mode if query not found
    +   ' if(result==-1)'
    +   ' {for(var index=0; index<this.current.length; index++)'
    +    ' {if(query==(this.current[index][1].toUpperCase()+this.current[index][2]).replace(/\s+/g, \'\')) {result=index; break;}'
    +     ' if(maybe==-1 && (this.current[index][1].toUpperCase()+this.current[index][2]).includes(query)) maybe=index;'
    +    '}}'
    +   ' if(result in this.current) {this.index=result; this.move(true); return \'\';}'
    +   ' else if(maybe in this.current) {this.index=maybe; this.move(true); return \'\';}'
    +   ' else console.log(query+\' not found\');'
    +   '  return \'\';'
    +   '},'
    + ' rewind: function() {this.move(false); return \'\';},'
    + ' write:'
    +  ' function()'
    +  ' {if(!(this.index in this.current)) return \'\';'
    +   ' var coordinates=[parseFloat(document.getElementById(\'currentPosX\').value), parseFloat(document.getElementById(\'currentPosY\').value)];'
    +   ' if(!isNaN(coordinates[0]) && !isNaN(coordinates[1]))'
    +   ' {this.current[this.index][3]=coordinates[0];'
    +    ' this.current[this.index][4]=coordinates[1];'
    +    ' if(this.current[this.index][2]==\'\' || this.current[this.index][2]==\'R1C1\') console.log(this.current[this.index][1]+\' adjusted to (\'+this.current[this.index][3]+\', \'+this.current[this.index][4]+\')\');'
    +    ' else console.log(this.current[this.index][1]+\' \'+this.current[this.index][2]+\' temporarily adjusted to (\'+this.current[this.index][3]+\', \'+this.current[this.index][4]+\') but only R1C1 can be repositioned\');'
    +   '}},'
    + ' check:'
    +  ' function(next)'
    +  ' {if(!(this.index in this.current)) return \'\';'
    +   ' var coordinates=[parseFloat(document.getElementById(\'currentPosX\').value), parseFloat(document.getElementById(\'currentPosY\').value)];'
    +   ' if(!isNaN(coordinates[0]) && !isNaN(coordinates[1]))'
    +   ' {if(parseFloat(this.current[this.index][3])!=coordinates[0] || parseFloat(this.current[this.index][4])!=coordinates[1])'
    +   '  if(confirm(this.current[this.index][1]+(this.current[this.index][2].trim()==\'\'?\'\':\' \')+this.current[this.index][2]+\' has been moved. Click OK to write the new position\'+(next?\' and proceed to the requested FOV\':\'\')+\'. Click Cancel to discard\'+(next?\' and proceed to the requested FOV\':\'\')+\'.\')) this.write();'
    +   '}},'
    +   tsai.navigation_code_sed_save()
    + ' toggle:'
    +  ' function()'
    +  ' {if(!(this.index in this.current)) return \'\';'
    +   ' this.current[this.index][6]=(this.current[this.index][6]==0?1:0);'
    +   ' console.log(this.current[this.index][1]+\' \'+this.current[this.index][2]+\' toggled \'+(this.current[this.index][6]==0?\'off\':\'on\'));'
    +   '},'
    + ' fov:'
    +  ' function(fov)'
    +  ' {if(!(this.index in this.current)) return \'\';'
    +   ' this.current[this.index][5]=fov;'
    +   ' if(this.current[this.index][2]==\'\' || this.current[this.index][2]==\'R1C1\') console.log(this.current[this.index][1]+\' \'+this.current[this.index][2]+\' FOV set to \'+fov+\' μm\');'
    +   ' else console.log(this.current[this.index][1]+\' \'+this.current[this.index][2]+\' FOV temporarily set to \'+fov+\' μm but only R1C1 FOV changes will take effect\');'
    +   '},'
    + ' list:'
    +  ' function(exportable, exit)'
    +  ' {this.check(false);'
    +   ' var widths=[];' // find maximum characters in each column
    +   ' for(var width=0; width<7; width++) widths.push(0);'
    +   ' widths.push(this.current.length.toString().length);'
    +   ' for(var index=0; index<this.current.length; index++)'
    +   ' {for(var column=0; column<widths.length-1; column++) {if(this.current[index][column].toString().length>widths[column]) widths[column]=this.current[index][column].toString().length;}'
    +    '}'
    +   ' var table=\'\';'
    +   ' var csv=\'\';'
    +   ' var off=\'\';'
    +   ' for(var index=0; index<this.current.length; index++)'
    +   ' {table+=\'\\n\'+(\' \'.repeat(widths[widths.length-1]-index.toString().length))+index+\'  \';'
    +    ' for(var column=1; column<widths.length-1; column++) table+=this.current[index][column]+(widths[column]==0?\'\':\' \'.repeat(widths[column]-this.current[index][column].toString().length+2));'
    +    ' if(this.current[index][6]==1) table+=\'on\';'
    +    ' else'
    +    ' {table+=\'off\';'
    +     ' off+=this.current[index][1]+\' \'+this.current[index][2]+\'\\n\';'
    +     '}'
    +    ' for(var column=0; column<widths.length-2; column++) csv+=this.current[index][column]+\',\';'
    +    ' csv+=this.current[index][widths.length-2]+\'\\n\';'
    +    '}'
    +   ' if(table==\'\') console.log(\'\\nNo FOV coordinates have been specified or imported\\n\\n\');'
    +   ' else if(exportable)'
    +   ' {var textarea=document.createElement(\'textarea\');'
    +    ' textarea.value=csv;'
    +    ' document.body.appendChild(textarea);'
    +    ' textarea.focus();'
    +    ' textarea.select();'
    +    ' var copy=false;'
    +    ' try {copy=document.execCommand(\'copy\');}'
    +    ' catch(error) {}'
    +    ' document.body.removeChild(textarea);'
    +    ' this.file(csv);'
    +    ' console.clear();'
    +    ' if(off!=\'\') console.log(\'\\nTiles toggled off:\\n\'+off);'
    +    ' console.log(\'\\nAdjustments:\\n\'+csv+\'\\n\');'
    +    ' var instructions=(exit?\'aste (Ctrl+V) into the FOV Navigation text box.\':\' Press D to continue to the next FOV or K to list the keyboard commands.\');'
    +    ' if(copy) console.log(\'Adjustments have been copied to the clipboard and exported to a file. P\'+instructions+\'\\n\');'
    +    ' else console.log(\'Adjustments have been exported to a file and shown above. Copy (Ctrl+C) the above adjusted coordinates and p\'+instructions+\'\\n\\n\');'
    +    '}'
    +   ' else console.log(table+\'\\n\\n\');'
    +   '},'
    + ' import:'
    +  ' function()'
    +  ' {if(!confirm(\'The current coordinates will be discarded and replaced with those in the MIBI run table. Are you sure?\')) return \'\';'
    +   ' this.current=[];'
    +   ' this.original=[];'
    +   ' var rows=document.getElementById(\'prerunFovs\').innerHTML.replace(/\\s*<!\\-\\-.*?\\-\\->\\s*/g, \'\').replace(/<\\\/t[dr]>\\s*/g, \'\').split(/\\s*<tr\\s.*?>\\s*/);'
    +   ' for(var row=0; row<rows.length; row++)'
    +   ' {var columns=rows[row].split(/\\s*<td\\s.*?>\\s*/);'
    +    ' if(columns.length==12)'
    +    ' {var fov=parseInt(columns[8]);'
    +     ' var dd=columns[3].split(/\\s*<\\\/?dd.*?>\\s*/);'
    +     ' if(dd.length==5)'
    +     ' {var index=this.current.length;'
    +      ' this.current.push([index, columns[2], \'\', dd[1].replace(/[^0-9\-\.]/g, \'\'), dd[3].replace(/[^0-9\\\-\\.]/g, \'\'), fov, 1]);'
    +      ' this.original.push([]);'
    +      ' this.original[index]=[...this.current[index]];'
    +    '}}}'
    +   ' this.list(false, false);'
    +   ' this.next();'
    +   '},'
    + ' jog:'
    +  ' function()'
    +  ' {if(document.getElementById(\'jogStagePopup\').hidden) document.getElementById(\'jogStageBtn\').click();'
    +   ' document.getElementById(\'jogStagePopup\').style.top=\'738px\';'
    +   ' document.getElementById(\'jogStagePopup\').style.left=\'448px\';'
    +   ' document.getElementById(\'inputJogIncrement\').value=5;'
    +   ' document.getElementById(\'inputJogIncrement\').dispatchEvent(new Event(\'input\'));'
    +   ' document.getElementsByClassName(\'crosshair\')[0].children[0].checked=false;'
    +   ' document.getElementsByClassName(\'crosshair\')[0].children[0].dispatchEvent(new Event(\'change\'));'
    +   '},'
    + ' zoom_bracket:'
    +  ' function(marks, order)'
    +  ' {this.context.beginPath();'
    +   ' this.context.moveTo(marks[order[0]], marks[order[1]]);'
    +   ' this.context.lineTo(marks[order[2]], marks[order[3]]);'
    +   ' this.context.lineTo(marks[order[4]], marks[order[5]]);'
    +   ' this.context.stroke();'
    +   '},'
    + ' zoom_colors: {800: \'#e50808\', 400: \'#1aecba\', 200: \'#f4795b\'},'
    + ' zoom:'
    +  ' function(fov)'
    +  ' {this.context.clearRect(0, 0, this.overlay.width, this.overlay.height);'
    +   ' var magnification=this.magnification();'
    +   ' if(!magnification) return \'\';'
    +   ' var length=15;'
    +   ' var width=3;'
    +   ' var opacity=0.6;'
    +   ' var maximum=parseInt(magnification.max);'
    +   ' fov=Math.min(fov, maximum);'
    +   ' magnification.value=fov;'
    +   ' magnification.dispatchEvent(new Event(\'input\'));'
    +   ' var brackets={400: [200], 800: [400, 200],};'
    +   ' brackets[maximum]=[800, 400];'
    +   ' this.context.lineWidth=width;'
    +   ' if(fov in brackets && document.getElementById(\'targetPosX\'))'
    +   ' {document.getElementsByClassName(\'crosshair\')[0].children[0].checked=false;'
    +    ' document.getElementsByClassName(\'crosshair\')[0].children[0].dispatchEvent(new Event(\'change\'));'
    +    ' this.context.lineCap=\'round\';'
    +    ' for(var bracket=0; bracket<brackets[fov].length; bracket++)'
    +    ' {var bracket_fov=brackets[fov][bracket];'
    +     ' this.context.strokeStyle=this.zoom_colors[bracket_fov];'
    +     ' var marks=[Math.round((fov-brackets[fov][bracket])*this.overlay.width/fov/2)];'
    +     ' marks=marks.concat([marks[0]+length, this.overlay.width-marks[0]-length, this.overlay.width-marks[0]]);'
    +     ' this.context.globalAlpha=opacity;'
    +     ' this.zoom_bracket(marks, [0, 1, 0, 0, 1, 0]);'
    +     ' this.zoom_bracket(marks, [2, 0, 3, 0, 3, 1]);'
    +     ' this.zoom_bracket(marks, [3, 2, 3, 3, 2, 3]);'
    +     ' this.zoom_bracket(marks, [1, 3, 0, 3, 0, 2]);'
    +     ' this.context.globalAlpha=1;'
    +     ' this.context.font=(bracket_fov==800?\'normal normal bold 12px Arial\':\'normal normal normal 12px Arial\');'
    +     ' this.context.fillStyle=this.zoom_colors[bracket_fov];'
    +     ' this.context.fillText(bracket_fov+\' μm\', 5, 15*bracket+(fov==800?28:32));'
    +     '}'
    +    ' this.context.globalAlpha=opacity;'
    +    ' this.context.strokeStyle=\'#6fc3ff\';'
    +    ' this.context.beginPath();'
    +    ' this.context.moveTo(0'              +', this.overlay.width/2);'
    +    ' this.context.lineTo(this.overlay.width, this.overlay.width/2);'
    +    ' this.context.stroke();'
    +    ' this.context.beginPath();'
    +    ' this.context.moveTo(this.overlay.width/2, 0);'
    +    ' this.context.lineTo(this.overlay.width/2, this.overlay.width);'
    +    ' this.context.stroke();'
    +    ' this.context.globalAlpha=1;'
    +    ' this.context.font=(fov==800?\'normal normal bold 12px Arial\':\'normal normal normal 12px Arial\');'
    +    ' this.context.fillStyle=\'#6fc3ff\';'
    +    ' this.context.fillText(fov+\' μm\', 5, 15);'
    +   '}},'
    + ' file:'
    +  ' function(text)'
    +  ' {var url=window.URL || window.webkitURL;'
    +   ' var anchor=document.createElement(\'a\');'
    +   ' anchor.href=url.createObjectURL(new Blob([text], {type: \'octet/stream\'}));'
    +   ' anchor.download=this.log.name+\'_\'+this.time().ymd+\'-\'+this.time().hms24+\'.txt\';'
    +   ' document.body.appendChild(anchor);'
    +   ' anchor.click();'
    +   ' document.body.removeChild(anchor);'
    +   '},'
    + ' time_pad: function(number) {if(String(number).length==1) return \'0\'+number; else return String(number);},'
    + ' time:'
    +  ' function()'
    +  ' {var time=new Date();'
    +   ' return {ymd: time.getFullYear()+\'-\'+this.time_pad(time.getMonth()+1)+\'-\'+this.time_pad(time.getDate()),'
    +    ' mdy: (time.getMonth()+1)+\'/\'+time.getDate()+\'/\'+time.getFullYear(),'
    +    ' hms24: this.time_pad(time.getHours())+this.time_pad(time.getMinutes())+this.time_pad(time.getSeconds())};'
    +   '},'
    +   tsai.navigation_code_logger()
    + ' key:'
    +  ' function(event)'
    +  ' {if(document.activeElement!=document.body) return;'
    +   ' switch(event.code)'
    +   ' {case \'KeyI\': this.import(); break;'
    +      tsai.navigation_code_arrows()
//  +    ' case \'KeyB\'  : this.zoom(50); break;'
//  +    ' case \'KeyN\'  : this.zoom(100); break;'
    +    ' case \'KeyM\'  : this.zoom(200); break;'
    +    ' case \'Comma\' : this.zoom(400); break;'
    +    ' case \'Period\': this.zoom(800); break;'
    +    ' case \'Slash\' : this.zoom(2000); break;'
    +    ' case \'KeyK\'  : this.commands(); break;'
    +    ' case \'KeyF\'  : this.list(false, false); break;'
    +    ' case \'KeyS\'  : this.sed((this.index in this.current?this.current[this.index][1]+\' \'+this.current[this.index][2]:\''+tsai.json.name.replaceAll('\'', '\\\'')+'_sed\')+\'.png\'); break;'
    +    ' case \'KeyB\'  : this.filter_crement(event.shiftKey?-0.1:0.1, 0); break;'
    +    ' case \'KeyC\'  : this.filter_crement(0, event.shiftKey?-0.1:0.1); break;'
    +    ' case \'KeyV\'  : if(event.shiftKey) this.filter_crement(1-this.filter_brightness, 1-this.filter_contrast); break;'
    +    ' case \'KeyL\'  : this.logger(); break;'
    +    ' case \'Escape\': this.exit(); break;'
    +    '}'
    +   ' if(this.current.length>0)'
    +   ' {switch(event.code)'
    +    ' {case \'KeyR\': this.rewind(); break;'
//  +     ' case \'BracketLeft\') this.first(); break;'
//  +     ' case \'BracketRight\') this.last(); break;'
    +     ' case \'KeyA\': this.previous(); break;'
    +     ' case \'KeyD\': this.next(); break;'
    +     ' case \'KeyG\': this.goto(); break;'
    +     ' case \'KeyT\': this.toggle(); break;'
    +     ' case \'Digit2\': this.fov(200); break;'
    +     ' case \'Digit4\': this.fov(400); break;'
    +     ' case \'Digit8\': this.fov(800); break;'
    +     ' case \'KeyW\': this.write(); break;'
    +     ' case \'KeyX\': this.list(true, false); break;'
    +    '}}'
    +   ' event.preventDefault();'
    +   ' return \'\';'
    +   '},'
    + ' commands:'
    +  ' function()'
    +  ' {console.log(\'\\n'
    +    '\\nMIBI FOV Navigation Tool'
    +    '\\nCopyright Albert G Tsai, MD, PhD'
    +    '\\n'
    +    '\\nControls:'
    +    '\\nA: Previous FOV'
    +    '\\nS: (S)ave SED image'
    +    '\\nD: Next FOV'
    +    '\\nW: (W)rite new coordinates to current FOV'
    +    '\\nR: (R)eturn to original coordinates (without writing)'
    +    '\\nT: (T)oggle FOV on/off'
    +    '\\n2: Write FOV to 200 μm'
    +    '\\n4: Write FOV to 400 μm'
    +    '\\n8: Write FOV to 800 μm'
    +    '\\nEsc: Generate export adjustment code and exit (unbind keys)'
    +    '\\n'
    +    '\\nUp    / Shift+ / Alt (Option)+: Jog up    2 / 3 / 1'
    +    '\\nDown  / Shift+ / Alt (Option)+: Jog down  2 / 3 / 1'
    +    '\\nLeft  / Shift+ / Alt (Option)+: Jog left  2 / 3 / 1'
    +    '\\nRight / Shift+ / Alt (Option)+: Jog right 2 / 3 / 1'
    +    '\\nZoom buttons require the magnification slider:'
//  +    '\\n  B        : Zoom SED to 50 μm'
//  +    '\\n  N        : Zoom SED to 100 μm'
    +    '\\n  M        : Zoom SED to 200 μm'
    +    '\\n  Comma  , : Zoom SED to 400 μm'
    +    '\\n  Period . : Zoom SED to 800 μm'
    +    '\\n  Slash  / : Zoom SED to widest'
    +    '\\n'
    +    '\\nB      : Increase SED brightness'
    +    '\\nShift+B: Decrease SED brightness'
    +    '\\nC      : Increase SED contrast'
    +    '\\nShift+C: Decrease SED contrast'
    +    '\\nShift+V: Reset SED brightness and contrast'
    +    '\\n'
    +    '\\nK: (K)eyboard command list'
    +    '\\nF: (F)OV list'
    +    '\\nG: (G)o to index/query'
    // + '\\n[: First FOV'
    // + '\\n]: Last FOV'
    +    '\\nL: (L)og kV and nA values for Google Sheet'
    +    '\\nI: (I)mport FOVs from table (not recommended)'
    +    '\\nX: Generate e(X)port adjustment code\');'
    +   '},'
    + ' exit:'
    +  ' function()'
    +  ' {this.list(true, true);'
    +   ' this.context.clearRect(0, 0, this.overlay.width, this.overlay.height);'
    +   ' this.filter_crement(1-this.filter_brightness, 1-this.filter_contrast);'
    +   ' document.removeEventListener(\'keydown\', fov_key, false);'
    +   ' fov=null;'
    +   ' console.log(\'Exited\\nMIBI FOV Navigation Tool\\nCopyright Albert G Tsai, MD, PhD\\n\\n\');'
    +   ' return \'\';'
    +   '}'
    +'};}'
   +' if(typeof fov_key===\'undefined\') {fov_key=function(event) {fov.key(event);}}'
   +' document.addEventListener(\'keydown\', fov_key, false);'
   +' for(fov.index=0; fov.index<fov.current.length; fov.index++)'
   +' {fov.current[fov.index].push(1);'
    +' fov.original[fov.index]=[...fov.current[fov.index]];'
    +'}'
   +' fov.index=-1;'
   +' fov.jog();'
   +' console.clear();'
   +' fov.commands();'
   +' fov.list(false);'
   +' console.log(\'Click on a blank area of the page (not a text box or image) to use the above controls.\\n\\n\');'
   +' if(fov.current.length>0) fov.next();';
   navigator.clipboard.writeText(b);
  }
  
  navigation_adjust_file(file)
  {(async () =>
    {const file_text=await file.text();
     tsai.element_toggle_on('navigation_toggle');
     document.getElementById('navigation_adjustments').value=file_text;
     tsai.navigation_adjust();
   }) ();
  }
  
  navigation_adjust()
  {var rows=document.getElementById('navigation_adjustments').value.replace(/[\n\r]+/g, '\n').split('\n');
   var adjustments=[];
   var list='';
   for(var row=0; row<rows.length; row++)
   {if(/^\s*$/.test(rows[row])) continue;
    var columns=rows[row].split(',');
    if(columns.length<7) tsai.navigation_errors('<li>Row '+(row+1)+' invalid: '+rows[row]+'</li>');
    else
    {// coordinates array [[0: tile index, 1: name, 2: R#C#, 3: x, 4: y, 5: FOV, 6: on/off], ...] pops in reverse order
     var on_off=(parseInt(columns.pop())==1?1:0);
     var fov=parseInt(columns.pop());
     var y=Math.round(parseFloat(columns.pop())*1000000)/1000;
     var x=Math.round(parseFloat(columns.pop())*1000000)/1000;
     var row_column=columns.pop();
     var tile=parseInt(columns.shift()); // tile index
     var name=columns.join(',').trim(); // if name has , in it
     if(isNaN(tile) || isNaN(x) || isNaN(y) || isNaN(fov) || (row_column!='' && !(/^R\d+C\d+$/.test(row_column)))) tsai.navigation_errors('</li>'+name+' coordinates input invalid: '+rows[row]+'</li>');
     else adjustments.push({tile: tile, name: name, row_column: row_column, x: x, y: y, fov: fov, on_off: on_off});
   }}
   for(var index=0; index<adjustments.length; index++)
   {var adjustment=adjustments[index];
    var tile=adjustment.tile;
    var name=document.getElementById('tile_'+tile+'_name').value.trim();
    if(name!=adjustment.name) tsai.navigation_errors('<li>Tile name '+adjustment.name+' does not match '+name+'</li>');
    if(!tsai.tiles[tile].active) tsai.navigation_errors('<li>'+name+' is inactive</li>');
    if(adjustment.row_column=='' || adjustment.row_column=='R1C1')
    {var x=parseFloat(document.getElementById('tile_'+tile+'_center_x').value);
     var y=parseFloat(document.getElementById('tile_'+tile+'_center_y').value);
     if(x!=adjustment.x || y!=adjustment.y)
     {document.getElementById('tile_'+tile+'_center_x').value=adjustment.x;
      document.getElementById('tile_'+tile+'_center_y').value=adjustment.y;
      tsai.tile_position_set(tile);
      list+='\n<li>'+name+' adjusted from ('+x+', '+y+') to ('+adjustment.x+', '+adjustment.y+')</li>';
     }
     var fov=parseInt(document.getElementById('tile_'+tile+'_fov').value);
     if(fov!=adjustment.fov)
     {if(!tsai.mibi.fovs.includes(adjustment.fov)) tsai.navigation_errors('</li>'+name+' could not be set to '+fov+' μm</li>');
      else
      {document.getElementById('tile_'+tile+'_fov').value=adjustment.fov;
       document.getElementById('tile_'+tile+'_fov').dispatchEvent(new Event('change'));
       list+='\n<li>'+name+' FOV set to '+adjustment.fov+' μm';
       var raster=parseInt(parseInt(document.getElementById('tile_'+tile+'_raster').value)*adjustment.fov/fov);
       if(tsai.mibi.rasters.includes(raster))
       {document.getElementById('tile_'+tile+'_raster').value=raster;
        document.getElementById('tile_'+tile+'_raster').dispatchEvent(new Event('change')); 
        list+=' at '+raster+'&times;'+raster+'</li>';
       }
       else
       {list+=', could not set raster to '+raster+'</li>';
        tsai.navigation_errors('</li>'+name+' raster could not be set to '+raster+'</li>');
     }}}
     if(adjustment.on_off==0)
     {tsai.tiles[tile].map[0][0]=0;
      list+='\n<li>'+name+(adjustment.row_column=='R1C1'?' R1C1':'')+' toggled off</li>';
    }}
    else if(adjustment.on_off==0) // R#C# specified and not R1C1
    {var row_column=adjustment.row_column.match(/^R(\d+)C(\d+)$/);
     var row=parseInt(row_column[1])-1;
     var column=parseInt(row_column[2])-1;
     if(row in tsai.tiles[tile].map && column in tsai.tiles[tile].map[row])
     {tsai.tiles[tile].map[row][column]=0;
      list+='\n<li>'+name+' '+adjustment.row_column+' toggled off</li>';
   }}}
   document.getElementById('navigation_adjustments_output').innerHTML='<ul>'+list+'</ul>';
  }
  
  /* ##########  ERROR FUNCTIONS  ########## */
  navigation_errors(errors)
  {if(errors!='')
   {var innerhtml=document.getElementById('navigation_errors').innerHTML;
    var index=innerhtml.lastIndexOf('</li>');
    if(index==-1) document.getElementById('navigation_errors').innerHTML='\n<div class="_layout_warnings">\n<h2>Errors</h2>\n<ul>'+errors.trim()+'</ul>\n<p><a href="javascript:navigation_errors_clear();">Clear errors\n</a>\n</p>\n</div>\n';
    else document.getElementById('navigation_errors').innerHTML=innerhtml.substring(0, index)+'\n'+errors.trim()+innerhtml.substring(index);
  }}
  
  navigation_errors_clear()
  {document.getElementById('navigation_errors').innerHTML='';
  }
  
  } // end class MIBI_TSAI
  