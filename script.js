document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("averageForm");
    // ลบการอ้างอิงถึงปุ่มลอยทั้งหมดออกไปแล้ว

    // ฟังก์ชันคำนวณค่าเฉลี่ยตามสูตรใหม่
    function calculateAverage(sku, mu, days) {
        return ((sku / 12) + (mu / 34)) / (2 * days);
    }

    // Submit form เพื่อไป average.html พร้อมส่งค่าเฉลี่ย
    if (form) { // ตรวจสอบว่า form มีอยู่บนหน้านี้หรือไม่
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const sku = Number(document.getElementById("sku").value);
            const mu = Number(document.getElementById("mu").value);
            const days = Number(document.getElementById("days").value);

            if (sku <= 0 || mu <= 0 || days <= 0) {
                alert("กรุณากรอกข้อมูลเป็นตัวเลขบวกมากกว่า 0 ทุกช่อง");
                return;
            }

            // ✅ บังคับ fullscreen และล็อกแนวนอนก่อนส่งข้อมูล (ถ้าเป็นมือถือ)
            // ฟังก์ชันนี้จะยังคงอยู่ เผื่อในอนาคตคุณสร้าง average.html
            // หรือต้องการบังคับ fullscreen เมื่อกด submit ในหน้าแรก
            try {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                if (isMobile) {
                    if (!document.fullscreenElement) {
                        await document.documentElement.requestFullscreen();
                    }
                    if (screen.orientation && screen.orientation.lock) {
                        await screen.orientation.lock('landscape');
                    }
                }
            } catch (error) {
                console.warn("Fullscreen หรือ ล็อกแนวนอน ไม่สำเร็จ:", error);
            }

            const avg = calculateAverage(sku, mu, days);

            // ส่งค่าเฉลี่ยเป็น query param ไป average.html
            // บรรทัดนี้จะยังคงอยู่ แต่จะทำงานเมื่อมีไฟล์ average.html แล้วเท่านั้น
            const params = new URLSearchParams({
                sku,
                mu,
                days,
                average: avg.toFixed(2)
            });

            window.location.href = `average.html?${params.toString()}`;
        });
    }

    // ไม่มี Event Listener สำหรับปุ่มลอยตัว (Floating Buttons) แล้วใน script.js นี้

    // เพิ่มฟังก์ชันเคลียร์ค่า input เมื่อกดปุ่มกากบาท
    document.querySelectorAll('.clear-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                input.value = "";
                input.focus();
            }
        });
    });
});
