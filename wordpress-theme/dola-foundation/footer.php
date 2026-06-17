<?php
defined('ABSPATH') || exit;
$s = df_get_settings();

$quick_links = [
    ['label' => 'Home', 'href' => home_url('/')],
    ['label' => 'About Us', 'href' => home_url('/about/')],
    ['label' => 'Programs', 'href' => home_url('/programs/')],
    ['label' => 'Projects', 'href' => home_url('/projects/')],
    ['label' => 'Gallery', 'href' => home_url('/gallery/')],
    ['label' => 'Blog', 'href' => home_url('/blog/')],
    ['label' => 'Volunteer', 'href' => home_url('/volunteer/')],
    ['label' => 'Contact', 'href' => home_url('/contact/')],
];
$programs = [
    ['label' => 'Education', 'href' => home_url('/programs/education/')],
    ['label' => 'Healthcare', 'href' => home_url('/programs/healthcare/')],
    ['label' => 'Charity & Relief', 'href' => home_url('/programs/charity-relief/')],
];
$socials = array_filter([
    'Facebook'  => $s['facebook_url'],
    'Instagram' => $s['instagram_url'],
    'Twitter'   => $s['twitter_url'],
    'YouTube'   => $s['youtube_url'],
]);
?>
<footer class="site-footer">
  <div class="container footer-main">
    <div class="footer-grid">
      <div>
        <a href="<?php echo esc_url(home_url('/')); ?>" class="footer-brand">
          <?php if ($s['logo_url']) : ?>
            <img src="<?php echo esc_url($s['logo_url']); ?>" alt="<?php echo esc_attr($s['site_name']); ?>" style="width:40px;height:40px;border-radius:0.75rem;object-fit:contain;">
          <?php else : ?>
            <span class="logo-fallback">♥</span>
          <?php endif; ?>
          <span>
            <span class="nav-brand-name" style="color:#fff;"><?php echo esc_html($s['site_name']); ?></span>
            <span style="font-size:0.75rem;color:#9ca3af;"><?php echo esc_html($s['tagline']); ?></span>
          </span>
        </a>
        <p class="footer-mission"><?php echo esc_html($s['footer_mission_text']); ?></p>
        <?php if ($socials) : ?>
        <div class="footer-socials">
          <?php foreach ($socials as $label => $url) : ?>
            <a class="footer-social-link" href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr($label); ?>"><?php echo esc_html(substr($label, 0, 1)); ?></a>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>
      </div>

      <div class="footer-col">
        <h3>Quick Links</h3>
        <ul>
          <?php foreach ($quick_links as $link) : ?>
            <li><a href="<?php echo esc_url($link['href']); ?>">→ <?php echo esc_html($link['label']); ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Our Programs</h3>
        <ul>
          <?php foreach ($programs as $program) : ?>
            <li><a href="<?php echo esc_url($program['href']); ?>">→ <?php echo esc_html($program['label']); ?></a></li>
          <?php endforeach; ?>
          <li><a href="<?php echo esc_url(home_url('/programs/')); ?>" style="color:rgba(244,180,0,0.7);font-size:0.8rem;">View all programs →</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Contact Us</h3>
        <ul class="footer-contact" style="margin-top:1rem;">
          <li><?php echo esc_html($s['address']); ?></li>
          <li><a href="tel:<?php echo esc_attr(preg_replace('/[^+0-9]/', '', $s['phone'])); ?>"><?php echo esc_html($s['phone']); ?></a></li>
          <li><a href="mailto:<?php echo esc_attr($s['email']); ?>"><?php echo esc_html($s['email']); ?></a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© <?php echo esc_html(date('Y')); ?> <?php echo esc_html($s['site_name']); ?>. All rights reserved. Built with ❤️ for a better world.</p>
      <div class="footer-bottom-links">
        <a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>">Privacy Policy</a>
        <span>•</span>
        <a href="<?php echo esc_url(home_url('/terms-of-use/')); ?>">Terms of Use</a>
      </div>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
