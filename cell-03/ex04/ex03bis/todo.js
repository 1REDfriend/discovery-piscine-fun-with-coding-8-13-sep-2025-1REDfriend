$(document).ready(() => {
    const EXPIRE_FUTURE = "Fri, 31 Dec 9999 23:59:59 GMT";
    const EXPIRE_PAST = "Thu, 01 Jan 1970 00:00:00 GMT";

    const setCookie = (k, v) => {
        document.cookie = `${k}=${encodeURIComponent(v)}; expires=${EXPIRE_FUTURE}; path=/; SameSite=Lax`;
    };

    const deleteCookie = (k) => {
        document.cookie = `${k}=; expires=${EXPIRE_PAST}; path=/; SameSite=Lax`;
    };

    const parseCookies = () =>
        (document.cookie || "")
            .split(";")
            .map(s => s.trim())
            .filter(Boolean)
            .map(kv => {
                const i = kv.indexOf("=");
                if (i < 0) return null;
                const key = kv.slice(0, i);
                const val = decodeURIComponent(kv.slice(i + 1));
                return { key, val };
            })
            .filter(Boolean);

    const makeNode = (txt, key) => {
        const $div = $("<div></div>").text(txt);
        $div.on("click", () => {
            const check = confirm("Do you want to delete");
            if (check) { $div.remove(); deleteCookie(key); }
        });
        return $div;
    };

    const $list = $("#ft_list");

    const create = () => {
        const txt = prompt("Please Enter TODO LIST :");
        if (!txt) return;
        const name = String(Date.now());
        setCookie(name, txt);
        $list.prepend(makeNode(txt, name));
    };

    $("#create").on("click", create);

    parseCookies().forEach(({ key, val }) => {
        $list.prepend(makeNode(val, key));
    });

    if (location.protocol === "file:") {
        console.warn("Cookies อาจไม่ทำงานเมื่อเปิดด้วย file:// — แนะนำให้รันผ่าน http server");
    }
});