import type { APIRoute } from "astro";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "src/lib/supabase";


export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();

        const file = formData.get("file") as File | null;
        const tipo = formData.get("tipo");
        const bloqueId = formData.get("bloqueId");

        if (!file) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No file received"
                }),
                { status: 400 }
            );
        }

        const originalBuffer = Buffer.from(await file.arrayBuffer());

        console.log("\n=== ORIGINAL ===");
        console.log(file.name, file.type, originalBuffer.length);

        // 🧠 convertir a webp
        const webpBuffer = await sharp(originalBuffer)
            .webp({ quality: 85 })
            .toBuffer();

        const fileName =
            file.name.replace(/\.[^/.]+$/, "") +
            "-" +
            Date.now() +
            ".webp";

        // 📦 subir a supabase
        const { data, error } = await supabaseAdmin.storage
            .from("NoticiasIMG")
            .upload(fileName, webpBuffer, {
                contentType: "image/webp",
                upsert: true
            });

        if (error) {
            console.error(error);
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Upload failed"
                }),
                { status: 500 }
            );
        }

        // 🔗 obtener URL pública
        const { data: publicUrlData } = supabaseAdmin.storage
            .from("NoticiasIMG")
            .getPublicUrl(fileName);

        const url = publicUrlData.publicUrl;

        console.log("\n=== UPLOADED ===");
        console.log(url);

        return new Response(
            JSON.stringify({
                success: true,
                url,
                tipo,
                bloqueId
            }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (err) {
        console.error(err);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Server error"
            }),
            { status: 500 }
        );
    }
};