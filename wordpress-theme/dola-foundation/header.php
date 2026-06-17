<?php
defined('ABSPATH') || exit;
$s = df_get_settings();
$site_name = $s['site_name'];
$tagline = $s['tagline'];
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
  <div class="container">
    <nav class="navbar">
      <a href="<?php echo esc_url(home_url('/')); ?>" class="nav-brand">
        <?php if ($s['logo_url']) : ?>
          <img src="<?php echo esc_url($s['logo_url']); ?>" alt="<?php echo esc_attr($site_name); ?>">
        <?php else : ?>
          <span class="logo-fallback">♥</span>
        <?php endif; ?>
        <span>
          <span class="nav-brand-name"><?php echo esc_html($site_name); ?></span>
          <span class="nav-brand-tagline"><?php echo esc_html($tagline); ?></span>
        </span>
      </a>

      <ul class="nav-links">
        <?php
        $current_url = trailingslashit(home_url($_SERVER['REQUEST_URI']));
        $nav_items = [
            ['label' => 'Home', 'href' => home_url('/')],
            ['label' => 'About', 'href' => home_url('/about/')],
            ['label' => 'Programs', 'href' => home_url('/programs/'), 'children' => [
                ['label' => 'Education', 'href' => home_url('/programs/education/')],
                ['label' => 'Healthcare', 'href' => home_url('/programs/healthcare/')],
                ['label' => 'Charity & Relief', 'href' => home_url('/programs/charity-relief/')],
            ]],
            ['label' => 'Projects', 'href' => home_url('/projects/')],
            ['label' => 'Gallery', 'href' => home_url('/gallery/')],
            ['label' => 'Blog', 'href' => home_url('/blog/')],
            ['label' => 'Volunteer', 'href' => home_url('/volunteer/')],
            ['label' => 'Contact', 'href' => home_url('/contact/')],
        ];
        foreach ($nav_items as $item) :
            $is_active = trailingslashit($item['href']) === $current_url;
        ?>
        <li>
          <a href="<?php echo esc_url($item['href']); ?>" class="<?php echo $is_active ? 'is-active' : ''; ?>">
            <?php echo esc_html($item['label']); ?>
            <?php if (!empty($item['children'])) : ?><span aria-hidden="true">▾</span><?php endif; ?>
          </a>
          <?php if (!empty($item['children'])) : ?>
          <div class="nav-dropdown">
            <div class="nav-dropdown-inner">
              <?php foreach ($item['children'] as $child) : ?>
                <a href="<?php echo esc_url($child['href']); ?>"><?php echo esc_html($child['label']); ?></a>
              <?php endforeach; ?>
            </div>
          </div>
          <?php endif; ?>
        </li>
        <?php endforeach; ?>
      </ul>

      <div class="nav-cta">
        <?php if ($s['donations_enabled']) : ?>
          <a href="<?php echo esc_url(home_url('/donate/')); ?>" class="btn btn-primary btn-sm donate-desktop">♥ Donate Now</a>
        <?php endif; ?>
        <button class="nav-toggle" id="df-mobile-open" aria-label="Open menu">☰</button>
      </div>
    </nav>
  </div>
</header>

<div class="mobile-overlay" id="df-mobile-overlay"></div>
<aside class="mobile-menu" id="df-mobile-menu">
  <div class="mobile-menu-header">
    <span class="nav-brand-name"><?php echo esc_html($site_name); ?></span>
    <button class="mobile-close" id="df-mobile-close" aria-label="Close menu">✕</button>
  </div>
  <nav>
    <?php foreach ($nav_items as $item) : ?>
      <a href="<?php echo esc_url($item['href']); ?>"><?php echo esc_html($item['label']); ?></a>
      <?php if (!empty($item['children'])) : foreach ($item['children'] as $child) : ?>
        <a class="sub-link" href="<?php echo esc_url($child['href']); ?>"><?php echo esc_html($child['label']); ?></a>
      <?php endforeach; endif; ?>
    <?php endforeach; ?>
    <?php if ($s['donations_enabled']) : ?>
      <a href="<?php echo esc_url(home_url('/donate/')); ?>" class="btn btn-primary" style="margin:1rem 1rem 0;justify-content:center;">♥ Donate Now</a>
    <?php endif; ?>
  </nav>
</aside>
