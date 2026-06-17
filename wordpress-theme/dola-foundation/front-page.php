<?php
defined('ABSPATH') || exit;
get_header();
$s = df_get_settings();

$heading = $s['hero_title'];
$comma_pos = strpos($heading, ',');
$heading_start = $comma_pos !== false ? substr($heading, 0, $comma_pos + 1) : null;
$heading_end = $comma_pos !== false ? trim(substr($heading, $comma_pos + 1)) : $heading;

$stats = [
    ['value' => $s['stat1_value'], 'label' => $s['stat1_label']],
    ['value' => $s['stat2_value'], 'label' => $s['stat2_label']],
    ['value' => $s['stat3_value'], 'label' => $s['stat3_label']],
    ['value' => $s['stat4_value'], 'label' => $s['stat4_label']],
];

$impact_cards = [
    ['icon' => '👥', 'value' => $s['stat1_value'], 'label' => $s['stat1_label'], 'desc' => "People whose lives we've touched"],
    ['icon' => '♥',  'value' => $s['stat2_value'], 'label' => $s['stat2_label'], 'desc' => 'Ongoing development programs'],
    ['icon' => '📍', 'value' => $s['stat3_value'], 'label' => $s['stat3_label'], 'desc' => 'Across Bangladesh'],
    ['icon' => '🤝', 'value' => $s['stat4_value'], 'label' => $s['stat4_label'], 'desc' => 'Dedicated change-makers'],
];

$gallery_images = get_posts([
    'post_type'      => 'attachment',
    'post_mime_type' => 'image',
    'posts_per_page' => 5,
    'meta_key'       => '_df_gallery_image',
    'meta_value'     => '1',
]);
?>

<section class="hero">
  <div class="hero-decor-1" aria-hidden="true"></div>
  <div class="hero-decor-2" aria-hidden="true"></div>

  <div class="container hero-grid">
    <div class="reveal">
      <?php if ($s['announcement_enabled'] && $s['announcement_text']) : ?>
        <span class="hero-badge"><?php echo esc_html($s['announcement_text']); ?></span>
      <?php endif; ?>

      <h1 class="hero-title">
        <?php if ($heading_start) : ?>
          <?php echo esc_html($heading_start); ?><br>
          <span class="accent"><?php echo esc_html($heading_end); ?></span>
        <?php else : ?>
          <?php echo esc_html($heading); ?>
        <?php endif; ?>
      </h1>

      <p class="hero-subtitle"><?php echo esc_html($s['hero_subtitle']); ?></p>

      <div class="hero-actions">
        <?php if ($s['donations_enabled']) : ?>
          <a href="<?php echo esc_url(home_url('/donate/')); ?>" class="btn btn-primary">♥ Donate Now</a>
        <?php endif; ?>
        <a href="<?php echo esc_url(home_url('/volunteer/')); ?>" class="btn btn-outline">👤 Become A Volunteer</a>
      </div>

      <div class="hero-stats">
        <?php foreach ($stats as $i => $stat) : ?>
          <?php if ($i > 0) : ?><span class="hero-stat-divider"></span><?php endif; ?>
          <div class="hero-stat">
            <div>
              <div class="hero-stat-value"><?php echo esc_html($stat['value']); ?></div>
              <div class="hero-stat-label"><?php echo esc_html($stat['label']); ?></div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="hero-media reveal">
      <div class="hero-media-frame">
        <div class="hero-media-bg"></div>
        <div class="hero-media-img">
          <img src="<?php echo esc_url($s['hero_image'] ?: get_template_directory_uri() . '/assets/images/hero-fallback.jpg'); ?>" alt="">
        </div>
      </div>
    </div>
  </div>

  <div class="hero-wave" aria-hidden="true">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path class="wave-layer-1" d="M0,40 C360,100 1080,0 1440,55 L1440,120 L0,120 Z"></path>
      <path class="wave-layer-2" d="M0,60 C360,120 1080,25 1440,80 L1440,120 L0,120 Z"></path>
      <path class="wave-layer-3" d="M0,85 C360,135 1080,45 1440,105 L1440,120 L0,120 Z"></path>
    </svg>
  </div>
</section>

<section class="impact-stats">
  <div class="container">
    <div class="impact-header reveal">
      <p class="impact-eyebrow">Our Impact</p>
      <h2 class="impact-title">Creating Real Change</h2>
    </div>
    <div class="impact-grid">
      <?php foreach ($impact_cards as $card) : ?>
        <div class="impact-card reveal">
          <div class="impact-icon"><?php echo esc_html($card['icon']); ?></div>
          <div class="impact-value"><?php echo esc_html($card['value']); ?></div>
          <div class="impact-label"><?php echo esc_html($card['label']); ?></div>
          <div class="impact-desc"><?php echo esc_html($card['desc']); ?></div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="gallery-section">
  <div class="container">
    <div class="gallery-section-header reveal">
      <div>
        <span class="section-eyebrow">Gallery</span>
        <h2 class="section-title">Our Gallery</h2>
        <p class="section-subtitle">Glimpses of our work and impact across communities.</p>
      </div>
      <a href="<?php echo esc_url(home_url('/gallery/')); ?>" class="btn btn-primary btn-sm">📷 View Full Gallery</a>
    </div>

    <div class="gallery-grid">
      <?php if ($gallery_images) : ?>
        <?php foreach ($gallery_images as $image) : ?>
          <div class="gallery-item reveal">
            <img src="<?php echo esc_url(wp_get_attachment_url($image->ID)); ?>" alt="<?php echo esc_attr($image->post_title); ?>">
            <div class="gallery-caption">
              <span class="title"><?php echo esc_html($image->post_title ?: 'Gallery image'); ?></span>
            </div>
          </div>
        <?php endforeach; ?>
      <?php else : ?>
        <p style="color:#9ca3af;grid-column:1/-1;">Add images in <strong>Media → Library</strong> and tag them as gallery images to show them here.</p>
      <?php endif; ?>
    </div>
  </div>
</section>

<?php get_footer(); ?>
