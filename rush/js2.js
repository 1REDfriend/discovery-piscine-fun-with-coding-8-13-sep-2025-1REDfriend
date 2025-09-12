(function () {

    const ICONS = {
        instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/><circle cx="12" cy="12" r="4" stroke="currentColor"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>`,
        facebook: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 11h3l-.5 3H13v8h-3v-8H8v-3h2V9.2C10 6.8 11.2 5 14.2 5H17v3h-2c-1 0-2 .2-2 1.6V11Z" fill="currentColor"/></svg>`,
        link: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10 14a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1" stroke="currentColor"/><path d="M14 10a5 5 0 0 1 0 7l-2 2a5 5 0 1 1-7-7l1-1" stroke="currentColor"/></svg>`
    };

    function readInlineJSON() {
        const el = document.getElementById('site-data');
        if (!el) return null;
        const txt = (el.textContent || '').trim();
        if (!txt) return null;
        try { return JSON.parse(txt); } catch (e) {
            console.error('Inline JSON ไม่ถูกต้อง:', e);
            return null;
        }
    }

    function loadJSONFile() {
        return $.getJSON('json.json');
    }

    function tagTokenNodes(tokens) {
        tokens.forEach(tok => {
            $(`*:contains('$${tok}')`).filter(function () {
                return $(this).children().length === 0 && $(this).text().trim() === '$' + tok;
            }).attr('data-token', tok);
        });
    }

    function normalizeContact(c) {
        return {
            email: c?.email || '',
            instagram: c?.instra || c?.instragram || c?.instagram || '',
            facebook: c?.facebook || '',
            intra: c?.intra || ''
        };
    }

    function boot(DATA) {

        $(".personBtn[data-person='A'] .font-semibold").text(DATA.header_title_text1.A);
        $(".personBtn[data-person='B'] .font-semibold").text(DATA.header_title_text1.B);

        tagTokenNodes(['header_title_text1', 'about']);

        function renderTokens(person) {
            $("[data-token]").each(function () {
                const tok = $(this).data('token');
                $(this).text((DATA[tok] || {})[person] || '');
            });
        }

        function renderHero(person) {
            $("#top h1 .text-blue-400").text(DATA.header_title_text1[person] || '');
        }

        function renderContact(person) {
            const c = normalizeContact(DATA.contact?.[person] || {});
            $("#emailP").text(c.email ? `Email : ${c.email}` : '');

            const $s = $("#socials").empty();

            const addIcon = (href, label, svg) => {
                if (!href) return;
                $s.append(
                    `<a class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-600/40 hover:border-slate-400/70 text-slate-200 hover:text-blue-400"
             href="${href}" target="_blank" rel="noopener" aria-label="${label}">${svg}</a>`
                );
            };

            addIcon(c.instagram, 'Instagram', ICONS.instagram);
            addIcon(c.facebook, 'Facebook', ICONS.facebook);
            addIcon(c.intra, 'Profile/42 Intra', ICONS.link);
        }

        function renderShowcase(person) {
            const url = (DATA.showcase && DATA.showcase[person]) || '';
            if (url) {
                $("#certImg").attr("src", url);
                $("#certLink").attr("href", url)
            } else {
                $("#certImg").attr("src", "");
                $("#certLink").attr("href", "#")
            }
        }

        function setActiveBtn(person) {
            $(".personBtn").removeClass("ring-2 ring-blue-600 ring-offset-2 ring-offset-slate-900");
            $(`.personBtn[data-person='${person}']`).addClass("ring-2 ring-blue-600 ring-offset-2 ring-offset-slate-900");
        }

        function renderAvatars(person) {
            $("#btnAImg").attr("src", DATA.avatars?.A || "A.png");
            $("#btnBImg").attr("src", DATA.avatars?.B || "B.png");

            $("#btnAImg").css("opacity", person === 'A' ? 1 : 0.5);
            $("#btnBImg").css("opacity", person === 'B' ? 1 : 0.5);

            const url = (DATA.avatars && DATA.avatars[person]) || '';
            if (url) {
                $('#topBg').css("background-image", `url(${url})`);
            } else {
                $('#topBg').css("background-image", `url(${url})`);
            }
        }

        function renderPerson(person) {
            renderHero(person);
            renderTokens(person);
            renderContact(person);
            renderShowcase(person);
            renderAvatars(person)
            setActiveBtn(person);
        }

        renderPerson('A');

        $(".personBtn").on("click", function () {
            renderPerson($(this).data("person") === 'B' ? 'B' : 'A');
        });
    }

    $(function () {
        const inline = readInlineJSON();
        if (inline) {
            boot(inline);
        } else {
            loadJSONFile()
                .done(boot)
                .fail(function (xhr) {
                    console.error('โหลด json.json ไม่ได้:', xhr.status, xhr.statusText);
                    alert('โหลด json.json ไม่ได้ — ต้องเปิดผ่าน Live Server/HTTP');
                });
        }
    });
})();
