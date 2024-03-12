import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { message } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import i18n from "@/context/i18n";

type Props = {
  queryAgentURL?: string;
};

type ChatParams = {
  chatId: string;
  data?: Record<string, any>;
  onMessage: (message: string) => void;
  onClose?: () => void;
  onDone?: () => void;
  onError?: (content: string, error?: Error) => void;
};

const useChat = ({ queryAgentURL = "/api/v1/chat/completions" }: Props) => {
  const ctrl = useMemo(() => new AbortController(), []);

  const chat = useCallback(
    async ({
      data,
      chatId,
      onMessage,
      onClose,
      onDone,
      onError,
    }: ChatParams) => {
      //   if (!data?.user_input && !data?.doc_id) {
      //     message.warning(i18n.t("NoContextTip"));
      //     return;
      //   }

        const parmas = {
          ...data,
        //   conv_uid: chatId,
        };

      //   if (!parmas.conv_uid) {
      //     message.error("conv_uid 不存在，请刷新后重试");
      //     return;
      //   }

      try {
        const response = await fetch(
          `${process.env.API_BASE_URL ?? ""}${queryAgentURL}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(parmas),
            signal: ctrl.signal,
          }
        );
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          const text = decoder.decode(value);
          onMessage(text);
        //   systemResponseMessage += text;
          // setCompetition(systemResponseMessage)

          if (done) {
            onDone && onDone()
            onClose && onClose()
            // const systemMessage: MessageProps = {
            //   id: Date.now().toString(),
            //   role: "system",
            //   content: systemResponseMessage,
            // };
            //   setMessages((current) => [...current, systemMessage]);
            //   setCompetition('');

            break;
          }
        }
      } catch (err) {
        ctrl.abort();
        onError?.(
          "Sorry, We meet some error, please try agin later.",
          err as Error
        );
      }

      //     await fetchEventSource(`${process.env.API_BASE_URL ?? ''}${queryAgentURL}`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(parmas),
      //       signal: ctrl.signal,
      //       openWhenHidden: true,
      //       async onopen(response) {
      //         if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
      //           return;
      //         }
      //       },
      //       onclose() {
      //         ctrl.abort();
      //         onClose?.();
      //       },
      //       onerror(err) {
      //         throw new Error(err);
      //       },
      //       onmessage: (event) => {
      //         const message = event.data?.replaceAll('\\n', '\n');
      //         if (message === '[DONE]') {
      //           onDone?.();
      //         } else if (message?.startsWith('[ERROR]')) {
      //           onError?.(message?.replace('[ERROR]', ''));
      //         } else {
      //           onMessage?.(message);
      //         }
      //       },
      //     });
      //   } catch (err) {
      //     ctrl.abort();
      //     onError?.('Sorry, We meet some error, please try agin later.', err as Error);
    },
    [queryAgentURL]
  );

  useEffect(() => {
    return () => {
      ctrl.abort();
    };
  }, []);

  return chat;
};

export default useChat;
