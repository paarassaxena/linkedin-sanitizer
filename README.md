# LinkedIn Feed Sanitizer (MVP)

A privacy-focused, client-side web application to filter out demotivating content from your LinkedIn feed.

## How to use
1.  Open `index.html` in any modern web browser (Chrome, Safari, Firefox).
2.  Go to LinkedIn and copy a chunk of your feed (select text -> Command+C).
3.  Paste it into the input area.
4.  Select your **Mood**:
    -   **Chill**: Hides stressful career talk (layoffs, hiring) AND influencer noise.
    -   **Focus**: Hides only the "influencer" engagement bait.
    -   **Validation**: Hides negative sentiment and failure stories.
5.  Click **Sanitise Feed**.

## Sample Text for Testing
Copy the block below to test the filters:

```text
I am thrilled to announce that I have joined Google as a Senior Vice President! #blessed #newjob

---

The market is tough right now. I've applied to 500 jobs and got 0 callbacks. It's impossible to get hired.

---

Here are 5 tips to become a 10x engineer. Buy my course linked in bio to learn more! Agree?

---

Just finished a great coffee chat with a mentor. Feeling inspired!

---

Sadly, our company announced layoffs today. 20% of the workforce is affected. Open to work.
```

## Features
-   **Zero data collection**: All processing happens in your browser.
-   **Premium UI**: Dark mode, glassmorphism, and smooth animations.
-   **Smart Filtering**: Heuristic keyword detection for different stress triggers.
