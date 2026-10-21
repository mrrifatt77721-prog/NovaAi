# Nova AI Telegram Mini App — বাংলা নির্দেশিকা

এই ZIP-এ মোবাইল-ফ্রেন্ডলি chat UI, ছবি সংযুক্তির বাটন, OpenAI Responses API-র backend, AI Video প্যানেল এবং ভিডিও API-র placeholder আছে।

## যা এখনো স্বয়ংক্রিয়ভাবে কাজ করবে না
নিজস্ব API key না যোগ করা পর্যন্ত AI chat কাজ করবে না। Video API provider বেছে তার official API adapter যোগ না করা পর্যন্ত আসল ভিডিও তৈরি হবে না। এই starter-এ ছবি বিশ্লেষণ আছে; PDF বা ভিডিও ফাইল বিশ্লেষণ নেই।

## মোবাইল দিয়ে deploy
1. ZIP extract করুন।
2. GitHub-এ নতুন repository তৈরি করে সব ফাইল upload করুন (`public` ফোল্ডারসহ)।
3. Node.js সমর্থিত hosting-এ repository connect করুন।
4. Start command: `npm start`। Hosting প্রয়োজনমতো dependencies install করবে।
5. Hosting-এর Environment Variables-এ `OPENAI_API_KEY` এবং প্রয়োজনে `OPENAI_MODEL` যোগ করুন।
6. Deploy শেষে পাওয়া HTTPS URL খুলে পরীক্ষা করুন।

## নিরাপত্তা
API key কখনো `public/index.html`, public GitHub repository বা chat-এ রাখবেন না। API ব্যবহারে খরচ হতে পারে; usage limit/budget সেট করুন এবং আপনি অপ্রাপ্তবয়স্ক হলে অভিভাবকের সাহায্য নিন। এই project নিজে API key তৈরি করে না।

## Telegram-এ যুক্ত করা
Deploy করা HTTPS URL-টি Telegram BotFather-এ Web App/Menu Button URL হিসেবে সেট করা যায়। পূর্ণাঙ্গ production Mini App-এর জন্য Telegram WebApp SDK ও server-side initData validation যোগ করতে হবে; শুধু client-side data বিশ্বাস করবেন না।

## Video API
`/api/video` আপাতত placeholder। কোন provider ব্যবহার করবেন তা নির্দিষ্ট হলে তার official API অনুযায়ী video job creation, status polling, result URL ও error handling যোগ করতে হবে। শুধু `VIDEO_API_URL` এবং `VIDEO_API_KEY` বসালেই যেকোনো provider কাজ করবে না।
