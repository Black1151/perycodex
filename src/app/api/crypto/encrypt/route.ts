import CryptoJS from "crypto-js";

export default function handler(req: { method: string; body: { data: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; encrypted?: string; }): void; new(): any; }; }; }) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { data } = req.body;
    const secretKey = process.env.ENCRYPTION_SECRET;

    if (!secretKey) {
        return res.status(500).json({ error: "Encryption key not set" });
    }

    try {
        const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
        res.status(200).json({ encrypted });
    } catch (err) {
        res.status(500).json({ error: "Encryption failed" });
    }
}
