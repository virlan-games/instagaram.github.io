// "use client";

// import React from "react";

// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Download, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";

// import { Input } from "@/components/ui/input";

// import { downloadFile } from "@/lib/utils";
// import { getHttpErrorMessage } from "@/lib/http";

// import { useVideoInfo } from "@/services/api/queries";

// const formSchema = z.object({
//   postUrl: z.string().url({
//     message: "Provide a valid Instagram post link",
//   }),
// });

// export function InstagramVideoForm() {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       postUrl: "",
//     },
//   });

//   const { error, isPending, mutateAsync: getVideoInfo } = useVideoInfo();

//   const httpError = getHttpErrorMessage(error);

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const { postUrl } = values;
//     try {
//       console.log("getting video info", postUrl);
//       const videoInfo = await getVideoInfo({ postUrl });

//       const { filename, videoUrl } = videoInfo;
//       downloadFile(videoUrl, { filename });
//     } catch (error: any) {
//       console.log(error);
//     }
//   }

//   return (
//     <Form {...form}>
//      <form
//         onSubmit={form.handleSubmit(onSubmit)}
// {/*         className="bg-accent/20 my-4 flex w-full max-w-2xl flex-col items-center rounded-lg border px-4 pb-16 pt-8 shadow-md sm:px-8" */}
//       >
//         <div className="mb-2 h-6 w-full px-2 text-start text-red-500">
//           {httpError}
//         </div>
//         <div className="relative mb-6 flex w-full flex-col items-center gap-4 sm:flex-row">
//           <FormField
//             control={form.control}
//             name="postUrl"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <Input
//                     disabled={isPending}
//                     type="url"
//                     placeholder="Paste your Instagram link here..."
//                     className="h-12 w-full sm:pr-28"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//          <Button
//   disabled={isPending}
//   type="submit"
//   className="right-1 top-1 w-full sm:absolute sm:w-fit bg-green-500 hover:bg-green-600 text-white"
// >
//   {isPending ? (
//     <Loader2 className="mr-2 animate-spin" />
//   ) : (
//     <Download className="mr-2" />
//   )}
//   Download
// </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }

import React, { useState } from "react";
import axios from "axios";

const InstagramReelsDownloader: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [videoLink, setVideoLink] = useState<string>("");

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a valid Instagram URL.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post<{ videoUrl: string }>("/api/get-video", { url });
      const { videoUrl } = response.data;

      if (videoUrl) {
        setVideoLink(videoUrl);
        // Automatically trigger download
        const anchor = document.createElement("a");
        anchor.href = videoUrl;
        anchor.download = "instagram-reel.mp4";
        anchor.click();
      } else {
        setError("Unable to fetch video. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Instagram Reels Video Downloader</h1>
      <p>Paste the URL of the Instagram reel to download the video.</p>

      <form onSubmit={handleDownload} style={{ maxWidth: "500px", margin: "auto" }}>
        <input
          type="url"
          placeholder="Paste Instagram URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "80%",
            padding: "10px",
            fontSize: "16px",
            marginBottom: "10px",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Download"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {videoLink && (
        <p>
          Video ready! If download doesn’t start automatically,{" "}
          <a href={videoLink} download>
            click here
          </a>
        </p>
      )}
    </div>
  );
};

export default InstagramReelsDownloader;
