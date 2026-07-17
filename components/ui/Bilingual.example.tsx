// Example usage of the Bilingual component
// This file demonstrates both single and paired modes

import { Bilingual } from './Bilingual';

// Example 1: Single mode - renders only active locale
export function SingleModeExample() {
  return (
    <div>
      <h1>
        <Bilingual
          content={{
            zh: 'AI 产品经理 · 软硬一体',
            en: 'AI PM · Hardware-AI Integration',
          }}
        />
      </h1>
      <p>
        <Bilingual
          content={{
            zh: '这是一个单语言模式的例子，根据当前语言设置显示对应内容。',
            en: 'This is a single-language mode example that displays content based on the current locale setting.',
          }}
        />
      </p>
    </div>
  );
}

// Example 2: Paired mode - renders both languages together (Req 3.5)
export function PairedModeExample() {
  return (
    <div>
      <Bilingual
        content={{
          zh: '从理解语义开始…',
          en: 'Starting from semantic understanding…',
        }}
        mode="paired"
        className="flex flex-col gap-2 md:flex-row md:gap-4"
        as="div"
      />
    </div>
  );
}

// Example 3: With ReactNode content
export function ReactNodeExample() {
  return (
    <Bilingual
      content={{
        zh: (
          <div className="font-zh">
            <strong>重要通知：</strong>
            <span>系统将于今晚维护</span>
          </div>
        ),
        en: (
          <div className="font-en">
            <strong>Important Notice:</strong>
            <span>System maintenance tonight</span>
          </div>
        ),
      }}
    />
  );
}

// Example 4: Chapter transitions (paired editorial style)
export function ChapterTransitionExample() {
  return (
    <section className="my-8">
      <Bilingual
        content={{
          zh: '…到调度智能体…',
          en: '…to orchestrating agents…',
        }}
        mode="paired"
        className="text-2xl font-display text-accent"
        as="p"
      />
    </section>
  );
}
