/*==================================================
                    QR SCANNER
==================================================*/

const qrModal = document.getElementById("qrModal");
const closeQrModal = document.getElementById("closeQrModal");
const scanQrNav =
    document.getElementById("qrNavLink");

const openQrBtn =
    document.getElementById("openQrBtn");

const qrStatus = document.getElementById("qr-status");
const qrReaderElement = document.getElementById("qr-reader");

const qrLinkInput =
    document.getElementById("qrLinkInput");

const qrLinkBtn =
    document.getElementById("qrLinkBtn");

let html5QrCode = null;
let qrScanning = false;
let qrProcessing = false;


/*==================================================
                OPEN QR MODAL
==================================================*/

function openQrScanner() {

    if (!qrModal) return;

    qrModal.classList.remove("hidden");

    qrProcessing = false;

    setQrStatus(
        "Đang mở camera...",
        "loading"
    );

    setTimeout(() => {

        startQrScanner();

    }, 200);

}


/*==================================================
                CLOSE QR MODAL
==================================================*/

async function closeQrScanner() {

    if (!qrModal) return;

    await stopQrScanner();

    qrModal.classList.add("hidden");

}


/*==================================================
                QR STATUS
==================================================*/

function setQrStatus(message, type = "info") {

    if (!qrStatus) return;

    let icon = "fa-camera";

    if (type === "success") {
        icon = "fa-circle-check";
    }

    if (type === "error") {
        icon = "fa-circle-exclamation";
    }

    if (type === "loading") {
        icon = "fa-spinner fa-spin";
    }

    qrStatus.innerHTML = `

        <i class="fa-solid ${icon}"></i>

        ${message}

    `;

    qrStatus.className = `qr-status ${type}`;

}


/*==================================================
                START SCANNER
==================================================*/

async function startQrScanner() {

    if (!qrReaderElement) return;

    if (typeof Html5Qrcode === "undefined") {

        setQrStatus(
            "Không thể tải trình quét QR.",
            "error"
        );

        return;

    }

    try {

        html5QrCode = new Html5Qrcode(
            "qr-reader"
        );

        const config = {

            fps: 10,

            qrbox: {

                width: 250,

                height: 250

            },

            aspectRatio: 1

        };

        await html5QrCode.start(

            {
                facingMode: "environment"
            },

            config,

            onQrSuccess,

            onQrError

        );

        qrScanning = true;

        setQrStatus(
            "Đưa mã QR vào khung để quét...",
            "info"
        );

    }

    catch (error) {

        console.error(
            "QR Scanner Error:",
            error
        );

        setQrStatus(
            "Không thể mở camera. Hãy kiểm tra quyền truy cập camera.",
            "error"
        );

    }

}


/*==================================================
                QR ERROR
==================================================*/

function onQrError(errorMessage) {

    // Không cần hiển thị lỗi liên tục.
    // Camera sẽ tiếp tục quét.
}


/*==================================================
                QR SUCCESS
==================================================*/

async function onQrSuccess(decodedText) {

    if (qrProcessing) return;

    qrProcessing = true;

    console.log(
        "QR Code:",
        decodedText
    );


    let qr = decodedText;


    /*
     * Nếu QR chứa URL
     * tự lấy ?qr=
     */

    try {

        if (
            decodedText.startsWith("http://") ||
            decodedText.startsWith("https://")
        ) {

            const url =
                new URL(decodedText);

            const qrParam =
                url.searchParams.get("qr");


            if (qrParam) {

                qr = qrParam;

            }

        }

    }

    catch (error) {

        console.log(
            "QR URL parsing:",
            error
        );

    }


    await verifyQrAndOpenMenu(qr);

}

/*==================================================
            HANDLE QR LINK / CODE
==================================================*/

async function handleQrLink() {

    const value = qrLinkInput.value.trim();

    if (!value) {

        setQrStatus(
            "Vui lòng nhập mã bàn hoặc link QR.",
            "error"
        );

        return;
    }

    let qr = value;

    /*
     * =========================================
     * TRƯỜNG HỢP 1:
     * Link dạng:
     * https://appdatmon.com/table/2
     * =========================================
     */

    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {

        try {

            const url = new URL(value);

            /*
             * Lấy query ?qr=
             */

            const qrParam =
                url.searchParams.get("qr");

            if (qrParam) {

                qr = qrParam;

            } else {

                /*
                 * Lấy /table/2
                 */

                const parts =
                    url.pathname
                        .split("/")
                        .filter(Boolean);

                const tableIndex =
                    parts.indexOf("table");

                if (
                    tableIndex !== -1 &&
                    parts[tableIndex + 1]
                ) {

                    qr =
                        parts[tableIndex + 1];

                } else {

                    throw new Error(
                        "Không tìm thấy mã bàn trong link QR."
                    );

                }

            }

        }

        catch (error) {

            console.error(error);

            setQrStatus(
                error.message ||
                "Link QR không hợp lệ.",
                "error"
            );

            return;

        }

    }


    console.log(
        "QR/Table value:",
        qr
    );


    await verifyQrAndOpenMenu(qr);

}

/*==================================================
            VERIFY QR AND OPEN MENU
==================================================*/

async function verifyQrAndOpenMenu(qr) {

    if (!qr) {

        setQrStatus(
            "Mã QR không hợp lệ.",
            "error"
        );

        return;

    }


    setQrStatus(
        "Đang kiểm tra mã bàn...",
        "loading"
    );


    try {

        const table = await api(

            `/api/tables/qr/${encodeURIComponent(qr)}`

        );


        if (!table) {

            throw new Error(
                "Không tìm thấy bàn."
            );

        }


        /*
         * Lưu QR
         */

        sessionStorage.setItem(

            "appdatmon_table_qr",

            qr

        );


        /*
         * Lưu thông tin bàn
         */

        sessionStorage.setItem(

            "appdatmon_table",

            JSON.stringify(table)

        );


        setQrStatus(

            `Đã xác nhận Bàn ${
                table.tableNumber ||
                table.id ||
                ""
            }`,

            "success"

        );


        /*
         * Dừng camera nếu đang chạy
         */

        await stopQrScanner();


        /*
         * Mở menu
         */

        setTimeout(() => {

            window.location.href =

                `menu.html?qr=${
                    encodeURIComponent(qr)
                }`;

        },700);


    }

    catch (error) {

        console.error(
            "QR validation:",
            error
        );


        setQrStatus(

            error.message ||

            "Mã QR không hợp lệ.",

            "error"

        );

    }

}


/*==================================================
                STOP SCANNER
==================================================*/

async function stopQrScanner() {

    if (!html5QrCode) return;

    try {

        if (qrScanning) {

            await html5QrCode.stop();

        }

    }

    catch (error) {

        console.log(
            "Stop QR scanner:",
            error
        );

    }

    try {

        html5QrCode.clear();

    }

    catch (error) {

        console.log(
            "Clear QR scanner:",
            error
        );

    }

    html5QrCode = null;

    qrScanning = false;

}


/*==================================================
                EVENTS
==================================================*/

if (scanQrNav) {

    scanQrNav.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            openQrScanner();

        }
    );

}

if (openQrBtn) {

    openQrBtn.addEventListener(
        "click",
        function () {

            openQrScanner();

        }
    );

}


if (closeQrModal) {

    closeQrModal.addEventListener(
        "click",
        function () {

            closeQrScanner();

        }
    );

}


const qrOverlay =
    document.querySelector(
        ".qr-modal-overlay"
    );


if (qrOverlay) {

    qrOverlay.addEventListener(
        "click",
        function () {

            closeQrScanner();

        }
    );

}


/*==================================================
            QR LINK EVENTS
==================================================*/

if (qrLinkBtn) {

    qrLinkBtn.addEventListener(
        "click",
        handleQrLink
    );

}


if (qrLinkInput) {

    qrLinkInput.addEventListener(
        "keydown",
        function(e) {

            if (e.key === "Enter") {

                e.preventDefault();

                handleQrLink();

            }

        }
    );

}