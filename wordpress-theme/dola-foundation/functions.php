<?php
defined('ABSPATH') || exit;

require_once get_template_directory() . '/inc/settings-page.php';

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    register_nav_menus([
        'primary' => __('Primary Navigation', 'dola-foundation'),
        'footer'  => __('Footer Navigation', 'dola-foundation'),
    ]);
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('df-google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap', [], null);
    wp_enqueue_style('df-main', get_template_directory_uri() . '/assets/css/main.css', [], '1.0.0');
    wp_enqueue_script('df-main', get_template_directory_uri() . '/assets/js/main.js', [], '1.0.0', true);
});

// Remove default WP admin bar spacing conflicts with the fixed header.
add_action('wp_head', function () {
    if (is_admin_bar_showing()) {
        echo '<style>.site-header{top:32px}@media(max-width:782px){.site-header{top:46px}}</style>';
    }
});

/** Helper: pull a value from the df_settings option with a fallback. */
function df_setting($key, $fallback = '') {
    $settings = df_get_settings();
    return $settings[$key] !== '' ? $settings[$key] : $fallback;
}
