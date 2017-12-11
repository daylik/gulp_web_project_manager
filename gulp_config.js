module.exports = {
    ftp_set: {
        parallel: 3,
        log: 'ftp.log',
        maxConnections: 5
    },
    config_ftp: {
        site_name : {
            url: '______.ru',
            local_folder:     'new_project_name',
            local_folder_css: 'new_project_name/source/css',
            local_folder_img: 'new_project_name/source/img',
            local_folder_js:  'new_project_name/source/js',
            theme_folder:     'new_project_name/public',
            theme_folder_css: 'new_project_name/public/css',
            theme_folder_js:  'new_project_name/public/js',
            theme_folder_img: 'new_project_name/public/img_min',
            ftp: {
                host: '______',
                port: 21,
                user: '______',
                pass: '______',
                parallel: 3,
                log: 'ftp.log',
                maxConnections: 5
            },
            ftp_path: '/www/wp-content/themes/new_project_name/',
            ftp_folder: {   
                img: '/img',
                css: '',
                js: '/js'
            },
            bower_plugins:[
                'jquery', 
                'magnific-popup'
            ]
        }
        //,
        //site_name : { ... }
        plugin_name: {
            local_folder_plugins: '',
            ftp_plugins_path: '/www/wp-content/plugins/plugin_name',
            ftp: {
                host: '______',
                port: 21,
                user: '______',
                pass: '______',
                parallel: 3,
                log: 'ftp.log',
                maxConnections: 5
            },
        }
}
};