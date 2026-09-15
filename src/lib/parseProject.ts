
export interface TocItem {
  id: string;
  name: string;
}

export interface ParsedProject {
  html: string;
  tableOfContents: TocItem[];
  readingTimeMinutes: number;
  header: string[];
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

export function parseProjectMd(md: string, _slug: string): ParsedProject {
  const lines: string[] = md
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  let html = '';
  let listBuffer: string[] = [];
  let divOpen = false;
  let fauxDivOpen = false;
  let contextAssigned = false;

  const header: string[] = [];
  const tableOfContents: TocItem[] = [];

  // Tags the first opening element in the doc (before any heading) as the
  // "Context" entry, whatever type that element happens to be.
  const withContext = (fragment: string): string => {
    if (contextAssigned || divOpen) return fragment;

    contextAssigned = true;
    tableOfContents.unshift({
      id: 'context',
      name: 'Context'
    });

    return fragment.replace(/^<(\w+)/, `<$1 id="context"`);
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

    // #startDiv opens a standalone "fauxContent" div, used to resume
    // text flow after a #gallery/media break without re-opening a full
    // heading section. It closes the same way a section does: on the
    // next heading, or explicitly via #endDiv.
    if (/^#startDiv\b/.test(line)) {
      html += '<div class="fauxContent">\n';
      fauxDivOpen = true;
      continue;
    }

    // #gallery, #flexGallery and #stiffGallery
    //
    // Example:
    // #gallery ![a.jpg; 1] +[b.mp4; 1; https://...]
    // #flexGallery ![a.jpg; 1] +[b.mp4; 1; https://...]
    // #stiffGallery ![a.jpg; 1] +[b.mp4; 1; https://...]
    //
    // Multiple image/video tokens are rendered side by side inside
    // a single wrapping div. The CSS class matches the tag name.
    const galleryMatch = line.match(
      /^#(gallery|flexGallery|stiffGallery)\s+(.+)/
    );

    if (galleryMatch) {
      const [, galleryClass, content] = galleryMatch[0].match(
        /^#(gallery|flexGallery|stiffGallery)\s+(.+)/
      )!;

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

    // ![path; sizeValue; url]  (image)
    // +[path; sizeValue; url]  (video)
    const media = line.match(/^([!+])\[(.+?)\]$/);

    if (media) {
      const [, marker, inner] = media;

      html += withContext(
        renderMedia(marker, inner) + '\n'
      );

      continue;
    }

    const headerMatch = line.match(/^#header\s+(.+)/);

    if (headerMatch) {
      header.push(
        ...headerMatch[1]
          .split(';')
          .map(s => s.trim())
          .filter(Boolean)
      );

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
        /*+ `<script async src="//www.instagram.com/embed.js"></script>\n`*/
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
        ? '<p class="arrows">-> </p>'
        : '';

      html += withContext(
        `<div class="${id}">${items.join(joiner)}</div>\n`
      );

      continue;
    }

    html += withContext(
      `<p>${inline(line)}</p>\n`
    );
  }

  flushList();

  if (fauxDivOpen) {
    html += '</div>\n';
    fauxDivOpen = false;
  }

  closeDiv();

  const readingTimeMinutes = estimateReadingTime(md);

  return {
    html,
    tableOfContents,
    readingTimeMinutes,
    header
  };
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
