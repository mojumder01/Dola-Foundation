<?php
/**
 * Site Settings admin page — mirrors the fields used on the Next.js site
 * (Admin > Settings) so content editors have an equivalent control panel.
 */

defined('ABSPATH') || exit;

function df_default_settings() {
    return [
        'site_name'            => 'Dola Foundation',
        'tagline'               => 'Empowering Lives',
        'logo_url'              => '',
        'hero_title'            => 'Empowering Lives, Inspiring Hope',
        'hero_subtitle'         => 'We work tirelessly to uplift underprivileged communities through education, healthcare, environmental protection, and sustainable development programs across Bangladesh.',
        'hero_image'            => '',
        'announcement_enabled'  => 1,
        'announcement_text'     => '✨ Empowering Communities Since 2015',
        'donations_enabled'     => 1,
        'stat1_value'           => '5,000+',
        'stat1_label'           => 'Lives Impacted',
        'stat2_value'           => '12',
        'stat2_label'           => 'Active Programs',
        'stat3_value'           => '8',
        'stat3_label'           => 'Districts',
        'stat4_value'           => '500+',
        'stat4_label'           => 'Volunteers',
        'address'               => 'Dhaka, Bangladesh',
        'phone'                 => '+880 1700-000000',
        'email'                 => 'info@dolafoundation.com',
        'facebook_url'          => '',
        'instagram_url'         => '',
        'twitter_url'           => '',
        'youtube_url'           => '',
        'footer_mission_text'   => 'We are dedicated to empowering communities through sustainable development, education, healthcare, and social welfare programs across Bangladesh.',
    ];
}

function df_get_settings() {
    $saved = get_option('df_settings', []);
    return wp_parse_args($saved, df_default_settings());
}

add_action('admin_menu', function () {
    add_menu_page(
        'Site Settings',
        'Site Settings',
        'manage_options',
        'df-settings',
        'df_render_settings_page',
        'dashicons-admin-customizer',
        59
    );
});

add_action('admin_post_df_save_settings', function () {
    if (!current_user_can('manage_options')) {
        wp_die('Not allowed');
    }
    check_admin_referer('df_save_settings');

    $defaults = df_default_settings();
    $clean = [];
    foreach ($defaults as $key => $default) {
        $raw = isset($_POST[$key]) ? wp_unslash($_POST[$key]) : '';
        if (is_int($default)) {
            $clean[$key] = isset($_POST[$key]) ? 1 : 0;
        } elseif (in_array($key, ['hero_subtitle', 'footer_mission_text'], true)) {
            $clean[$key] = sanitize_textarea_field($raw);
        } elseif (str_ends_with($key, '_url') || in_array($key, ['hero_image', 'logo_url'], true)) {
            $clean[$key] = sanitize_text_field($raw);
        } elseif ($key === 'email') {
            $clean[$key] = sanitize_email($raw);
        } else {
            $clean[$key] = sanitize_text_field($raw);
        }
    }

    update_option('df_settings', $clean);
    wp_safe_redirect(add_query_arg(['page' => 'df-settings', 'saved' => '1'], admin_url('admin.php')));
    exit;
});

function df_render_settings_page() {
    $s = df_get_settings();
    ?>
    <div class="wrap">
        <h1>Dola Foundation — Site Settings</h1>
        <?php if (!empty($_GET['saved'])) : ?>
            <div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="df_save_settings">
            <?php wp_nonce_field('df_save_settings'); ?>

            <h2>Branding</h2>
            <table class="form-table">
                <tr><th><label for="site_name">Site Name</label></th>
                    <td><input class="regular-text" type="text" id="site_name" name="site_name" value="<?php echo esc_attr($s['site_name']); ?>"></td></tr>
                <tr><th><label for="tagline">Tagline</label></th>
                    <td><input class="regular-text" type="text" id="tagline" name="tagline" value="<?php echo esc_attr($s['tagline']); ?>"></td></tr>
                <tr><th><label for="logo_url">Logo URL</label></th>
                    <td><input class="regular-text" type="text" id="logo_url" name="logo_url" value="<?php echo esc_attr($s['logo_url']); ?>" placeholder="https://...">
                        <button type="button" class="button df-media-picker" data-target="logo_url">Choose from Media Library</button></td></tr>
            </table>

            <h2>Hero Section</h2>
            <table class="form-table">
                <tr><th><label for="hero_title">Hero Title</label></th>
                    <td><input class="regular-text" type="text" id="hero_title" name="hero_title" value="<?php echo esc_attr($s['hero_title']); ?>"></td></tr>
                <tr><th><label for="hero_subtitle">Hero Subtitle</label></th>
                    <td><textarea class="large-text" rows="3" id="hero_subtitle" name="hero_subtitle"><?php echo esc_textarea($s['hero_subtitle']); ?></textarea></td></tr>
                <tr><th><label for="hero_image">Hero Image</label></th>
                    <td><input class="regular-text" type="text" id="hero_image" name="hero_image" value="<?php echo esc_attr($s['hero_image']); ?>" placeholder="https://...">
                        <button type="button" class="button df-media-picker" data-target="hero_image">Choose from Media Library</button>
                        <?php if ($s['hero_image']) : ?><br><img src="<?php echo esc_url($s['hero_image']); ?>" style="max-width:200px;margin-top:8px;border-radius:8px;"><?php endif; ?></td></tr>
                <tr><th><label for="announcement_enabled">Announcement Bar</label></th>
                    <td><label><input type="checkbox" id="announcement_enabled" name="announcement_enabled" value="1" <?php checked($s['announcement_enabled'], 1); ?>> Show announcement badge</label></td></tr>
                <tr><th><label for="announcement_text">Announcement Text</label></th>
                    <td><input class="regular-text" type="text" id="announcement_text" name="announcement_text" value="<?php echo esc_attr($s['announcement_text']); ?>"></td></tr>
            </table>

            <h2>Donations</h2>
            <table class="form-table">
                <tr><th><label for="donations_enabled">Enable Donations</label></th>
                    <td><label><input type="checkbox" id="donations_enabled" name="donations_enabled" value="1" <?php checked($s['donations_enabled'], 1); ?>> Show Donate Now buttons site-wide</label></td></tr>
            </table>

            <h2>Homepage Stats</h2>
            <table class="form-table">
                <?php for ($i = 1; $i <= 4; $i++) : ?>
                <tr><th>Stat <?php echo $i; ?></th>
                    <td>
                        Value: <input type="text" name="stat<?php echo $i; ?>_value" value="<?php echo esc_attr($s["stat{$i}_value"]); ?>" style="width:120px;">
                        Label: <input type="text" name="stat<?php echo $i; ?>_label" value="<?php echo esc_attr($s["stat{$i}_label"]); ?>" style="width:200px;">
                    </td></tr>
                <?php endfor; ?>
            </table>

            <h2>Contact &amp; Social</h2>
            <table class="form-table">
                <tr><th><label for="address">Address</label></th>
                    <td><input class="regular-text" type="text" id="address" name="address" value="<?php echo esc_attr($s['address']); ?>"></td></tr>
                <tr><th><label for="phone">Phone</label></th>
                    <td><input class="regular-text" type="text" id="phone" name="phone" value="<?php echo esc_attr($s['phone']); ?>"></td></tr>
                <tr><th><label for="email">Email</label></th>
                    <td><input class="regular-text" type="email" id="email" name="email" value="<?php echo esc_attr($s['email']); ?>"></td></tr>
                <tr><th><label for="facebook_url">Facebook URL</label></th>
                    <td><input class="regular-text" type="text" id="facebook_url" name="facebook_url" value="<?php echo esc_attr($s['facebook_url']); ?>"></td></tr>
                <tr><th><label for="instagram_url">Instagram URL</label></th>
                    <td><input class="regular-text" type="text" id="instagram_url" name="instagram_url" value="<?php echo esc_attr($s['instagram_url']); ?>"></td></tr>
                <tr><th><label for="twitter_url">Twitter URL</label></th>
                    <td><input class="regular-text" type="text" id="twitter_url" name="twitter_url" value="<?php echo esc_attr($s['twitter_url']); ?>"></td></tr>
                <tr><th><label for="youtube_url">YouTube URL</label></th>
                    <td><input class="regular-text" type="text" id="youtube_url" name="youtube_url" value="<?php echo esc_attr($s['youtube_url']); ?>"></td></tr>
            </table>

            <h2>Footer</h2>
            <table class="form-table">
                <tr><th><label for="footer_mission_text">Footer Mission Text</label></th>
                    <td><textarea class="large-text" rows="3" id="footer_mission_text" name="footer_mission_text"><?php echo esc_textarea($s['footer_mission_text']); ?></textarea></td></tr>
            </table>

            <?php submit_button('Save Settings'); ?>
        </form>
    </div>
    <script>
    document.querySelectorAll('.df-media-picker').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var target = document.getElementById(btn.dataset.target);
            var frame = wp.media({ title: 'Select Image', multiple: false });
            frame.on('select', function () {
                var attachment = frame.state().get('selection').first().toJSON();
                target.value = attachment.url;
            });
            frame.open();
        });
    });
    </script>
    <?php
}

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'toplevel_page_df-settings') {
        wp_enqueue_media();
    }
});
