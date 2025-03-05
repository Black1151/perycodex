import CryptoJS from "crypto-js";

export default function handler(req: { method: string; body: { encryptedData: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; decrypted?: string; }): void; new(): any; }; }; }) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { encryptedData } = req.body;
    const secretKey = process.env.ENCRYPTION_SECRET;

    if (!secretKey) {
        return res.status(500).json({ error: "Encryption key not set" });
    }

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        res.status(200).json({ decrypted });
    } catch (err) {
        res.status(500).json({ error: "Decryption failed" });
    }
}
