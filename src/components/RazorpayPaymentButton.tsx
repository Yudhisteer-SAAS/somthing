import { useEffect, useMemo, useRef } from "react";

type RazorpayPaymentButtonProps = {
    paymentButtonId: string;
    formFields?: Record<string, string | number>;
};

const RazorpayPaymentButton = ({
    paymentButtonId,
    formFields = {},
}: RazorpayPaymentButtonProps) => {
    const hostRef = useRef<HTMLDivElement | null>(null);

    const serializedFields = useMemo(
        () => JSON.stringify(formFields),
        [formFields],
    );

    useEffect(() => {
        const host = hostRef.current;
        if (!host) {
            return;
        }

        host.innerHTML = "";

        const form = document.createElement("form");
        const parsedFields = JSON.parse(serializedFields) as Record<
            string,
            string | number
        >;

        Object.entries(parsedFields).forEach(([name, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = String(value);
            form.appendChild(input);
        });

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.async = true;
        script.setAttribute("data-payment_button_id", paymentButtonId);

        form.appendChild(script);
        host.appendChild(form);

        return () => {
            host.innerHTML = "";
        };
    }, [paymentButtonId, serializedFields]);

    return <div ref={hostRef} className="razorpay-button-host" />;
};

export default RazorpayPaymentButton;
