"use client";

import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { downloadFile } from "@/lib/utils";
import { getHttpErrorMessage } from "@/lib/http";

import { useVideoInfo } from "@/services/api/queries";

const formSchema = z.object({
  postUrl: z.string().url({
    message: "Provide a valid Instagram post link",
  }),
});

export function InstagramVideoForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postUrl: "",
    },
  });

  const { error, isPending, mutateAsync: getVideoInfo } = useVideoInfo();

  const httpError = getHttpErrorMessage(error);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { postUrl } = values;
    try {
      console.log("getting video info", postUrl);
      const videoInfo = await getVideoInfo({ postUrl });

      const { filename, videoUrl } = videoInfo;
      downloadFile(videoUrl, { filename });
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
     <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="w-full max-w-2xl px-4 sm:px-8 py-8 min-h-[200px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"
>
  <div className="mb-2 h-6 w-full px-2 text-start text-red-500">
    {httpError}
  </div>
  <div className="relative mb-6 flex w-full flex-col items-center gap-4 sm:flex-row">
    <FormField
      control={form.control}
      name="postUrl"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Input
              disabled={isPending}
              type="url"
              placeholder="Paste URL Instagram"
              className="h-12 w-full sm:pr-28 rounded-lg bg-white/95 border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button
      disabled={isPending}
      type="submit"
      className="right-1 top-1 w-full sm:absolute sm:w-fit bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg border-0"
    >
      {isPending ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : (
        <Download className="mr-2" />
      )}
      Download
    </Button>
  </div>
</form>
    </Form>
  );
}
