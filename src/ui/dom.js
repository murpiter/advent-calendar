export const $ = (id) => document.getElementById(id);

export function el(tag, className = '', text = null) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

export function trustedSvg(className, markup) {
  const node = el('span', className);
  node.innerHTML = markup;
  return node;
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
