<?php
defined('ABSPATH') || exit;
get_header();
?>
<main class="container" style="padding:9rem 0 4rem; max-width:900px;">
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article>
      <h1 class="hero-title" style="font-size:2rem;"><?php the_title(); ?></h1>
      <div><?php the_content(); ?></div>
    </article>
  <?php endwhile; endif; ?>
</main>
<?php get_footer(); ?>
