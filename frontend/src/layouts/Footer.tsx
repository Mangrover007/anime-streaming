import { useState } from "react";

const Footer = () => {
    const [formData, setFormData] = useState<{
        email: string,
        content: string
    }>();

    return <div className="h-[180px] px-[100px] text-white bg-[#0f0c1a] flex items-center justify-between shadow-md">
        test
    </div>
}

export default Footer;
