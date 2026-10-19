export interface ParsedProject {
  html: string;
}

interface TocItem {
  id: string;
  name: string;
}

const WORDS_PER_MINUTE = 200;

// Renders a single media token (image or video), optionally wrapped in a
// link if a url is provided as the third `;`-separated param.
// inner is the raw content between the brackets, e.g. "path; 1; https://..."
function renderMedia(marker: string, inner: string): string {
  const parts = inner.split(';').map(p => p.trim());
  const path = parts[0];
  const sizeValue = parts[1];
  const url = parts[2];

  const size = sizeValue
    ? (/^\d+$/.test(sizeValue) ? `${sizeValue}` : sizeValue)
    : undefined;

  const style = size ? ` style="--s: ${size}"` : '';

  const media = marker === '+'
    ? `<video src="/projects/content/${path}"${style} autoplay loop muted playsinline></video>`
    : `<img src="/projects/content/${path}" alt="${path}"${style} />`;

  return url
    ? `<a href="${url}" target="_blank" rel="noopener">${media}</a>`
    : media;
}

// Renders the #info line and appends READ TIME as the last item.
function renderInfo(raw: string, readingTimeMinutes: number): string {
  const entries = raw
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  entries.push(`READ, ${readingTimeMinutes}min`);

  const items = entries.map(entry => {
    const comma = entry.indexOf(',');

    if (comma === -1) {
      return `<div class="infoItem"><p class="value">${inline(entry)}</p></div>`;
    }

    const label = entry.slice(0, comma).trim();
    const value = entry.slice(comma + 1).trim();

    return `<div class="infoItem">` +
      `<span class="label">${label}</span>` +
      `<p class="value">${inline(value)}</p>` +
      `</div>`;
  });

  return `<div class="info">${items.join('\n')}</div>\n`;
}

function renderToc(items: TocItem[]): string {
  if (!items.length) return '';

  const links = items
    .map(item => `<a href="#${item.id}" class="internal">${item.name}</a>`)
    .join('\n');

  return `<div id="tableOfContents">\n${links}\n</div>\n`;
}

export function parseProjectMd(md: string, _slug: string): ParsedProject {
  const lines: string[] = md
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const readingTimeMinutes = estimateReadingTime(md);

  let html = '';
  let listBuffer: string[] = [];
  let divOpen = false;
  let fauxDivOpen = false;
  let contextAssigned = false;

  // The TOC is inserted immediately before the first section.
  // Its placeholder is replaced after all headings have been collected.
  const tocPlaceholder = '<!--TOC_PLACEHOLDER-->';
  let tocInserted = false;

  const tableOfContents: TocItem[] = [];

  const withContext = (fragment: string): string => {
    if (contextAssigned || divOpen) return fragment;

    contextAssigned = true;
    tableOfContents.unshift({ id: 'context', name: 'Context' });

    const tagged = fragment.replace(/^<(\w+)/, `<$1 id="context"`);

    return tagged.replace(
      /^<p\b[\s\S]*?<\/p>/,
      match => `<!--reveal-start-->${match}<!--reveal-end-->`
    );
  };

  const flushList = (): void => {
    if (listBuffer.length) {
      const listHtml = listBuffer
        .map((item, i) => `<p><span>${i + 1}.</span> ${inline(item)}</p>`)
        .join('\n') + '\n';

      html += withContext(listHtml);
      listBuffer = [];
    }
  };

  const closeDiv = (): void => {
    if (divOpen) {
      html += '</div></div>\n';
      divOpen = false;
    }
  };

  for (const line of lines) {
    const liMatch = line.match(/^\d+\.\s+(.+)/);

    if (liMatch) {
      listBuffer.push(liMatch[1]);
      continue;
    }

    flushList();

    if (/^#endDiv\b/.test(line)) {
      if (fauxDivOpen) {
        html += '</div>\n';
        fauxDivOpen = false;
      } else {
        closeDiv();
      }

      continue;
    }

    // Opens a standalone fauxContent div.
    if (/^#startDiv\b/.test(line)) {
      html += '<div class="fauxContent">\n';
      fauxDivOpen = true;
      continue;
    }

    // #gallery, #flexGallery and #stiffGallery
    const galleryMatch = line.match(
      /^#(gallery|flexGallery|stiffGallery)\s+(.+)/
    );

    if (galleryMatch) {
      const [, galleryClass, content] = galleryMatch;

      const tokenRegex = /([!+])\[([^\]]+)\]/g;
      const items: string[] = [];

      let m: RegExpExecArray | null;

      while ((m = tokenRegex.exec(content)) !== null) {
        const [, marker, inner] = m;
        items.push(renderMedia(marker, inner));
      }

      html += withContext(
        `<div class="${galleryClass}">${items.join('\n')}</div>\n`
      );

      continue;
    }

    // ![path; sizeValue; url] (image)
    // +[path; sizeValue; url] (video)
    const media = line.match(/^([!+])\[(.+?)\]$/);

    if (media) {
      const [, marker, inner] = media;

      html += withContext(renderMedia(marker, inner) + '\n');
      continue;
    }

    // #header is swallowed and not rendered.
    if (/^#header\b/.test(line)) {
      continue;
    }

    const infoMatch = line.match(/^#info\s+(.+)/);

    if (infoMatch) {
      html += renderInfo(infoMatch[1], readingTimeMinutes);
      continue;
    }

    const phraseMatch = line.match(/^#phrase\s+(.+)/);

    if (phraseMatch) {
      html += withContext(
        `<p class="phrase">${inline(phraseMatch[1])}</p>\n`
      );

      continue;
    }

    const igEmbedMatch = line.match(/^#igEmbed\s+(.+)/);

    if (igEmbedMatch) {
      const url = igEmbedMatch[1].trim();
      const permalink = url.endsWith('/') ? url : `${url}/`;

      html += withContext(
        `<blockquote class="instagram-media" data-instgrm-permalink="${permalink}" data-instgrm-version="14" style="width:100%; max-width:100%; min-width:auto; margin:0;">` +
        `<div style="padding:16px;"></div>` +
        `</blockquote>\n`
      );

      continue;
    }

    const heading = line.match(/^#\s+(.+)/);

    if (heading) {
      if (fauxDivOpen) {
        html += '</div>\n';
        fauxDivOpen = false;
      }

      closeDiv();

      // Place a placeholder before the first section.
      // The complete TOC is generated after parsing all headings.
      if (!tocInserted) {
        html += tocPlaceholder + '\n';
        tocInserted = true;
      }

      const title = heading[1];
      const id = sanitize(title);

      html += `<div class="section">\n`;
      html += `<h2 id="${id}">${inline(title)}</h2>\n`;
      html += `<div class="content">\n`;

      divOpen = true;

      tableOfContents.push({
        id,
        name: title
      });

      continue;
    }

    const tag = line.match(/^#(\w+)\s+(.+)/);

    if (tag) {
      const [, id, rest] = tag;

      const sentences = rest.split(/(?<=[;])\s+/);

      const items = sentences.map(
        s => `<p class="blocks">${inline(s.trim().slice(0, -1))}</p>`
      );

      const joiner = id === 'logicChain'
        ? '<p class="arrows"><img class=" iconSize1" src="/icons/arrowRight.svg" alt="" /></p>'
        : '';

      html += withContext(
        `<div class="${id}">${items.join(joiner)}</div>\n`
      );

      continue;
    }

    html += withContext(`<p>${inline(line)}</p>\n`);
  }

  flushList();

  if (fauxDivOpen) {
    html += '</div>\n';
    fauxDivOpen = false;
  }

  closeDiv();

  // Generate the complete TOC after every heading has been collected.
  const tocHtml = renderToc(tableOfContents);

  if (tocInserted) {
    html = html.replace(tocPlaceholder, tocHtml);
  } else {
    // If there are no sections, place the TOC at the top.
    html = tocHtml + html;
  }

  return { html };
}

function estimateReadingTime(md: string): number {
  const plainText = md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/[#>*_`-]/g, '');

  const wordCount = plainText
    .split(/\s+/)
    .filter(Boolean)
    .length;

  return Math.max(
    1,
    Math.ceil(wordCount / WORDS_PER_MINUTE)
  );
}

function sanitize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function inline(text: string): string {
  return text.replace(
    /\[(.+?)\]\((.+?)\)/g,
    (_match, label, href) => {
      const target = href.startsWith('/')
        ? 'class="internal"'
        : ' target="_blank" rel="noopener"';

      return `<a href="${href}"${target}>${label}</a>`;
    }
  );
}