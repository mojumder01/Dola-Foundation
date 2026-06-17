<?php
defined('ABSPATH') || exit;
get_header();
?>
<main class="container" style="padding:9rem 0 4rem;">
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article>
      <h1 class="hero-title" style="font-size:1.75rem;"><?php the_title(); ?></h1>
      <div><?php the_content(); ?></div>
    </article>
  <?php endwhile; else : ?>
    <p>Nothing found.</p>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
