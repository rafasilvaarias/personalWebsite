import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch(`/projects/${params.slug}.md`);
  const md = await res.text();
  return { md, slug: params.slug };
};