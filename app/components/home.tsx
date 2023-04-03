"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import { IconButton } from "./button";
import styles from "./home.module.scss";

import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";

import BotIcon from "../icons/bot.svg";
import AddIcon from "../icons/add.svg";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";
import SendWhiteIcon from "../icons/send-white.svg";

import { useAccessStore, useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import Locale from "../locales";
import { ChatList } from "./chat-list";
import { Chat } from "./chat";

import dynamic from "next/dynamic";
import { REPO_URL } from "../constant";
import { Modal } from "./ui-lib";
import { ErrorBoundary } from "./error";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"]}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

// <<<<<<< HEAD
// const Emoji = dynamic(async () => (await import("emoji-picker-react")).Emoji, {
//   loading: () => <LoadingIcon />,
// });

// export function Avatar(props: { role: Message["role"] }) {
//   const config = useChatStore((state) => state.config);

//   if (props.role === "assistant") {
//     return <BotIcon className={styles["user-avtar"]} />;
//   }

//   return (
//     <div className={styles["user-avtar"]}>
//       <Emoji unified={config.avatar} size={18} />
//     </div>
//   );
// }

// export function ChatItem(props: {
//   onClick?: () => void;
//   onDelete?: () => void;
//   title: string;
//   count: number;
//   time: string;
//   selected: boolean;
// }) {
//   return (
//     <div
//       className={`${styles["chat-item"]} ${
//         props.selected && styles["chat-item-selected"]
//       }`}
//       onClick={props.onClick}
//     >
//       <div className={styles["chat-item-title"]}>{props.title}</div>
//       <div className={styles["chat-item-info"]}>
//         <div className={styles["chat-item-count"]}>
//           {Locale.ChatItem.ChatItemCount(props.count)}
//         </div>
//         <div className={styles["chat-item-date"]}>{props.time}</div>
//       </div>
//       <div className={styles["chat-item-delete"]} onClick={props.onDelete}>
//         <DeleteIcon />
//       </div>
//     </div>
//   );
// }

// export function ChatList() {
//   const [sessions, selectedIndex, selectSession, removeSession] = useChatStore(
//     (state) => [
//       state.sessions,
//       state.currentSessionIndex,
//       state.selectSession,
//       state.removeSession,
//     ],
//   );

//   return (
//     <div className={styles["chat-list"]}>
//       {sessions.map((item, i) => (
//         <ChatItem
//           title={item.topic}
//           time={item.lastUpdate}
//           count={item.messages.length}
//           key={i}
//           selected={i === selectedIndex}
//           onClick={() => selectSession(i)}
//           onDelete={() => confirm(Locale.Home.DeleteChat) && removeSession(i)}
//         />
//       ))}
//     </div>
//   );
// }

// function useSubmitHandler() {
//   const config = useChatStore((state) => state.config);
//   const submitKey = config.submitKey;

//   const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key !== "Enter") return false;
//     if (e.key === "Enter" && e.nativeEvent.isComposing) return false;
//     return (
//       (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
//       (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
//       (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
//       (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
//       (config.submitKey === SubmitKey.Enter &&
//         !e.altKey &&
//         !e.ctrlKey &&
//         !e.shiftKey &&
//         !e.metaKey)
//     );
//   };

//   return {
//     submitKey,
//     shouldSubmit,
//   };
// }

// export function PromptHints(props: {
//   prompts: Prompt[];
//   onPromptSelect: (prompt: Prompt) => void;
// }) {
//   if (props.prompts.length === 0) return null;

//   return (
//     <div className={styles["prompt-hints"]}>
//       {props.prompts.map((prompt, i) => (
//         <div
//           className={styles["prompt-hint"]}
//           key={prompt.title + i.toString()}
//           onClick={() => props.onPromptSelect(prompt)}
//         >
//           <div className={styles["hint-title"]}>{prompt.title}</div>
//           <div className={styles["hint-content"]}>{prompt.content}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export function Chat(props: {
//   showSideBar?: () => void;
//   sideBarShowing?: boolean;
// }) {
//   type RenderMessage = Message & { preview?: boolean };

//   const chatStore = useChatStore();
//   const [session, sessionIndex] = useChatStore((state) => [
//     state.currentSession(),
//     state.currentSessionIndex,
//   ]);
//   const fontSize = useChatStore((state) => state.config.fontSize);

//   const inputRef = useRef<HTMLTextAreaElement>(null);
//   const [userInput, setUserInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { submitKey, shouldSubmit } = useSubmitHandler();

//   // prompt hints
//   const promptStore = usePromptStore();
//   const [promptHints, setPromptHints] = useState<Prompt[]>([]);
//   const onSearch = useDebouncedCallback(
//     (text: string) => {
//       setPromptHints(promptStore.search(text));
//     },
//     100,
//     { leading: true, trailing: true },
//   );

//   const onPromptSelect = (prompt: Prompt) => {
//     setUserInput(prompt.content);
//     setPromptHints([]);
//     inputRef.current?.focus();
//   };

//   const scrollInput = () => {
//     const dom = inputRef.current;
//     if (!dom) return;
//     const paddingBottomNum: number = parseInt(
//       window.getComputedStyle(dom).paddingBottom,
//       10,
//     );
//     dom.scrollTop = dom.scrollHeight - dom.offsetHeight + paddingBottomNum;
//   };

//   // only search prompts when user input is short
//   const SEARCH_TEXT_LIMIT = 30;
//   const onInput = (text: string) => {
//     scrollInput();
//     setUserInput(text);
//     const n = text.trim().length;

//     // clear search results
//     if (n === 0) {
//       setPromptHints([]);
//     } else if (!chatStore.config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
//       // check if need to trigger auto completion
//       if (text.startsWith("/") && text.length > 1) {
//         onSearch(text.slice(1));
//       }
//     }
//   };

//   // submit user input
//   const onUserSubmit = () => {
//     if (userInput.length <= 0) return;
//     setIsLoading(true);
//     chatStore.onUserInput(userInput).then(() => setIsLoading(false));
//     setUserInput("");
//     setPromptHints([]);
//     if (!isMobileScreen()) inputRef.current?.focus();
//   };

//   // stop response
//   const onUserStop = (messageIndex: number) => {
//     console.log(ControllerPool, sessionIndex, messageIndex);
//     ControllerPool.stop(sessionIndex, messageIndex);
//   };

//   // check if should send message
//   const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (shouldSubmit(e)) {
//       onUserSubmit();
//       e.preventDefault();
//     }
//   };
//   const onRightClick = (e: any, message: Message) => {
//     // auto fill user input
//     if (message.role === "user") {
//       setUserInput(message.content);
//     }

//     // copy to clipboard
//     if (selectOrCopy(e.currentTarget, message.content)) {
//       e.preventDefault();
//     }
//   };

//   const onResend = (botIndex: number) => {
//     // find last user input message and resend
//     for (let i = botIndex; i >= 0; i -= 1) {
//       if (messages[i].role === "user") {
//         setIsLoading(true);
//         chatStore
//           .onUserInput(messages[i].content)
//           .then(() => setIsLoading(false));
//         inputRef.current?.focus();
//         return;
//       }
//     }
//   };

//   // for auto-scroll
//   const latestMessageRef = useRef<HTMLDivElement>(null);
//   const dialogBoxRef = useRef<HTMLDivElement>(null);
//   const [autoScroll, setAutoScroll] = useState(true);

//   const config = useChatStore((state) => state.config);

//   // preview messages
//   const messages = (session.messages as RenderMessage[])
//     .concat(
//       isLoading
//         ? [
//             {
//               role: "assistant",
//               content: "……",
//               date: new Date().toLocaleString(),
//               preview: true,
//             },
//           ]
//         : [],
//     )
//     .concat(
//       userInput.length > 0
//         ? [
//             {
//               role: "user",
//               content: userInput,
//               date: new Date().toLocaleString(),
//               preview: true,
//             },
//           ]
//         : [],
//     );

//   // auto scroll
//   useLayoutEffect(() => {
//     setTimeout(() => {
//       const dom = latestMessageRef.current;
//       const inputDom = inputRef.current;
//       const dialogBox = dialogBoxRef.current!;

//       // only scroll when input overlaped message body
//       let shouldScroll = true;
//       if (dom && inputDom) {
//         const domRect = dom.getBoundingClientRect();
//         const inputRect = inputDom.getBoundingClientRect();
//         shouldScroll = domRect.top > inputRect.top;
//       }

//       if (dom && autoScroll && shouldScroll) {
//         console.log(dialogBox.scrollHeight, dialogBox.clientHeight);
//         dialogBox.scrollTo({
//           top: dialogBox.scrollHeight - dialogBox.clientHeight,
//         });
//       }
//     }, 500);
//   });

//   // Fix Chinese input method "Enter" issue
//   document.addEventListener(
//     "keydown",
//     (e) => {
//       if (e.keyCode == 229) e.stopPropagation();
//     },
//     true,
//   );

//   return (
//     <div className={styles.chat} key={session.id}>
//       <div className={styles["window-header"]}>
//         <div
//           className={styles["window-header-title"]}
//           onClick={props?.showSideBar}
//         >
//           <div
//             className={`${styles["window-header-main-title"]} ${styles["chat-body-title"]}`}
//             onClick={() => {
//               const newTopic = prompt(Locale.Chat.Rename, session.topic);
//               if (newTopic && newTopic !== session.topic) {
//                 chatStore.updateCurrentSession(
//                   (session) => (session.topic = newTopic!),
//                 );
//               }
//             }}
//           >
//             {session.topic}
//           </div>
//           <div className={styles["window-header-sub-title"]}>
//             {Locale.Chat.SubTitle(session.messages.length)}
//           </div>
//         </div>
//         <div className={styles["window-actions"]}>
//           <div className={styles["window-action-button"] + " " + styles.mobile}>
//             <IconButton
//               icon={<MenuIcon />}
//               bordered
//               title={Locale.Chat.Actions.ChatList}
//               onClick={props?.showSideBar}
//             />
//           </div>
//           <div className={styles["window-action-button"]}>
//             <IconButton
//               icon={<BrainIcon />}
//               bordered
//               title={Locale.Chat.Actions.CompressedHistory}
//               onClick={() => {
//                 showMemoryPrompt(session);
//               }}
//             />
//           </div>
//           <div className={styles["window-action-button"]}>
//             <IconButton
//               icon={<ExportIcon />}
//               bordered
//               title={Locale.Chat.Actions.Export}
//               onClick={() => {
//                 exportMessages(session.messages, session.topic);
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       <div className={styles["chat-body"]} ref={dialogBoxRef}>
//         {messages.map((message, i) => {
//           const isUser = message.role === "user";

//           return (
//             <div
//               key={i}
//               className={
//                 isUser ? styles["chat-message-user"] : styles["chat-message"]
//               }
//             >
//               <div className={styles["chat-message-container"]}>
//                 <div className={styles["chat-message-avatar"]}>
//                   <Avatar role={message.role} />
//                 </div>
//                 {(message.preview || message.streaming) && (
//                   <div className={styles["chat-message-status"]}>
//                     {Locale.Chat.Typing}
//                   </div>
//                 )}
//                 <div className={styles["chat-message-item"]}>
//                   {!isUser &&
//                     !(message.preview || message.content.length === 0) && (
//                       <div className={styles["chat-message-top-actions"]}>
//                         {message.streaming ? (
//                           <div
//                             className={styles["chat-message-top-action"]}
//                             onClick={() => onUserStop(i)}
//                           >
//                             {Locale.Chat.Actions.Stop}
//                           </div>
//                         ) : (
//                           <div
//                             className={styles["chat-message-top-action"]}
//                             onClick={() => onResend(i)}
//                           >
//                             {Locale.Chat.Actions.Retry}
//                           </div>
//                         )}

//                         <div
//                           className={styles["chat-message-top-action"]}
//                           onClick={() => copyToClipboard(message.content)}
//                         >
//                           {Locale.Chat.Actions.Copy}
//                         </div>
//                       </div>
//                     )}
//                   {(message.preview || message.content.length === 0) &&
//                   (!isUser || !config.sendPreviewBubble) ? (
//                     <LoadingIcon />
//                   ) : (
//                     <div
//                       className="markdown-body"
//                       style={{ fontSize: `${fontSize}px` }}
//                       onContextMenu={(e) => onRightClick(e, message)}
//                       onDoubleClickCapture={() => {
//                         if (!isMobileScreen()) return;
//                         setUserInput(message.content);
//                       }}
//                     >
//                       <Markdown content={message.content} />
//                     </div>
//                   )}
//                 </div>
//                 {!isUser && !message.preview && (
//                   <div className={styles["chat-message-actions"]}>
//                     <div className={styles["chat-message-action-date"]}>
//                       {message.date.toLocaleString()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={latestMessageRef} style={{ opacity: 0, height: "1px" }}>
//           -
//         </div>
//       </div>

//       <div className={styles["chat-input-panel"]}>
//         <PromptHints prompts={promptHints} onPromptSelect={onPromptSelect} />
//         <div className={styles["chat-input-panel-inner"]}>
//           <textarea
//             ref={inputRef}
//             className={styles["chat-input"]}
//             placeholder={isMobileScreen() ? "" : Locale.Chat.Input(submitKey)}
//             rows={isMobileScreen() ? 2 : 4}
//             onInput={(e) => onInput(e.currentTarget.value)}
//             value={userInput}
//             onKeyDown={onInputKeyDown}
//             onFocus={() => setAutoScroll(true)}
//             onBlur={() => {
//               if (!isMobileScreen()) setAutoScroll(false);
//               setTimeout(() => setPromptHints([]), 500);
//             }}
//             autoFocus={!props?.sideBarShowing}
//           />
//           <IconButton
//             icon={<SendWhiteIcon />}
//             text={isMobileScreen() ? "" : Locale.Chat.Send}
//             className={styles["chat-input-send"] + " no-dark"}
//             onClick={onUserSubmit}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// >>>>>>

function useSwitchTheme() {
  const config = useChatStore((state) => state.config);

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const themeColor = getComputedStyle(document.body)
      .getPropertyValue("--theme-color")
      .trim();
    const metaDescription = document.querySelector('meta[name="theme-color"]');
    metaDescription?.setAttribute("content", themeColor);
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

const useAccess = () => {
  const accessStore = useAccessStore.getState();
  const [code, setCode] = useState(accessStore.accessCode);
  const [close, setClose] = useState(false);

  const onClose = () => {
    setClose(true);
    accessStore.updateCode(code);
  };

  if (accessStore.token && accessStore.token.length > 3) {
    return;
  }
  if (accessStore.accessCode && accessStore.accessCode.length > 3) {
    return;
  }
  if (close) {
    return;
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Modal
          title={Locale.Settings.AccessCode.Placeholder}
          actions={[
            <IconButton
              className={styles["ok-button"]}
              key="ok"
              icon={<SendWhiteIcon />}
              noDark
              text={"OK"}
              onClick={onClose}
            />,
          ]}
          onClose={onClose}
        >
          <input
            className={styles["chat-input"]}
            type="text"
            style={{
              width: "100%",
              height: "50px",
              padding: "0",
              maxWidth: "100%",
            }}
            placeholder={Locale.Settings.AccessCode.Placeholder}
            onChange={(e) => {
              setCode(e.currentTarget.value);
            }}
            value={code}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClose();
              }
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

function _Home() {
  const [createNewSession, currentIndex, removeSession] = useChatStore(
    (state) => [
      state.newSession,
      state.currentSessionIndex,
      state.removeSession,
    ],
  );
  const loading = !useHasHydrated();
  const [showSideBar, setShowSideBar] = useState(true);

  // setting
  const [openSettings, setOpenSettings] = useState(false);
  const config = useChatStore((state) => state.config);

  useSwitchTheme();

  const accessModal = useAccess();

  // useEffect(() => {
  //   document.addEventListener(
  //     "keydown",
  //     (e) => {
  //       if (e.keyCode == 229) e.stopPropagation();
  //     },
  //     true,
  //   );
  // }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      {accessModal}
      <div
        className={styles.sidebar + ` ${showSideBar && styles["sidebar-show"]}`}
      >
        <div className={styles["sidebar-header"]}>
          <div className={styles["sidebar-title"]}>ChatGPT Next</div>
          <div className={styles["sidebar-sub-title"]}>
            Build your own AI assistant.
          </div>
          <div className={styles["sidebar-logo"]}>
            <ChatGptIcon />
          </div>
        </div>

        <div
          className={styles["sidebar-body"]}
          onClick={() => {
            setOpenSettings(false);
            setShowSideBar(false);
          }}
        >
          <ChatList />
        </div>

        <div className={styles["sidebar-tail"]}>
          <div className={styles["sidebar-actions"]}>
            <div className={styles["sidebar-action"]}>
              <IconButton
                icon={<SettingsIcon />}
                onClick={() => {
                  setOpenSettings(true);
                  setShowSideBar(false);
                }}
                shadow
              />
            </div>
            {/* <div className={styles["sidebar-action"]}>
              <a href={REPO_URL} target="_blank">
                <IconButton icon={<GithubIcon />} shadow />
              </a>
            </div> */}
          </div>
          <div>
            <IconButton
              icon={<AddIcon />}
              text={Locale.Home.NewChat}
              onClick={() => {
                createNewSession();
                setShowSideBar(false);
              }}
              shadow
            />
          </div>
        </div>
      </div>

      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings
            closeSettings={() => {
              setOpenSettings(false);
              setShowSideBar(true);
            }}
          />
        ) : (
          <Chat
            key="chat"
            showSideBar={() => setShowSideBar(true)}
            chatShowing={!showSideBar && !openSettings}
          />
        )}
      </div>
    </div>
  );
}

export function Home() {
  return (
    <ErrorBoundary>
      <_Home></_Home>
    </ErrorBoundary>
  );
}
