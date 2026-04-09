const PAYMENT_BUTTON_SCRIPT_URL = "https://checkout.razorpay.com/v1/payment-button.js";
const PAYMENT_BUTTON_SELECTOR = ".razorpay-payment-button";

export const triggerRazorpayPaymentButton = (
    paymentButtonId: string,
    timeoutMs = 12000,
) => {
    if (typeof document === "undefined") {
        return Promise.reject(
            new Error("Razorpay payment can only be started in the browser."),
        );
    }

    return new Promise<void>((resolve, reject) => {
        const host = document.createElement("div");
        host.style.position = "fixed";
        host.style.left = "-9999px";
        host.style.top = "-9999px";
        host.style.width = "1px";
        host.style.height = "1px";
        host.style.overflow = "hidden";

        const form = document.createElement("form");
        const script = document.createElement("script");
        script.src = PAYMENT_BUTTON_SCRIPT_URL;
        script.async = true;
        script.setAttribute("data-payment_button_id", paymentButtonId);

        form.appendChild(script);
        host.appendChild(form);
        document.body.appendChild(host);

        let finished = false;
        let pollTimer: number | undefined;
        let timeoutTimer: number | undefined;

        const cleanup = () => {
            if (pollTimer !== undefined) {
                window.clearInterval(pollTimer);
            }
            if (timeoutTimer !== undefined) {
                window.clearTimeout(timeoutTimer);
            }
            window.setTimeout(() => {
                host.remove();
            }, 2000);
        };

        const fail = (message: string) => {
            if (finished) {
                return;
            }
            finished = true;
            cleanup();
            reject(new Error(message));
        };

        const succeed = () => {
            if (finished) {
                return;
            }
            finished = true;
            cleanup();
            resolve();
        };

        script.onerror = () => {
            fail("Could not load Razorpay checkout script.");
        };

        script.onload = () => {
            pollTimer = window.setInterval(() => {
                const button = form.querySelector<HTMLButtonElement>(
                    PAYMENT_BUTTON_SELECTOR,
                );
                if (!button) {
                    return;
                }

                button.click();
                succeed();
            }, 120);

            timeoutTimer = window.setTimeout(() => {
                fail("Razorpay payment button did not initialize in time.");
            }, timeoutMs);
        };
    });
};
