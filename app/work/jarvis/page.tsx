'use client';

import { motion } from 'framer-motion';
import { ProjectPage, sectionVariants } from '@/components/project/ProjectPage';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { MetricGrid } from '@/components/project/MetricGrid';
import { TechStackList } from '@/components/project/TechStackList';
import { JarvisLoader } from '@/components/project/ProjectLoaders';
import { Bilingual } from '@/components/ui/Bilingual';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { projectsMeta } from '@/content/projectsMeta';
import JarvisMDX from '@/content/projects/jarvis.mdx';
import JarvisMDXZh from '@/content/projects/jarvis.zh.mdx';

const meta = projectsMeta[0];

const METRICS = [
  { value: 'P95<200ms', label: <Bilingual content={{ zh: '端到端延迟目标', en: 'End-to-end latency target' }} /> },
  { value: '18 agents', label: <Bilingual content={{ zh: '注册表中的领域智能体', en: 'Domain agents in registry' }} /> },
  { value: '4 levels', label: <Bilingual content={{ zh: '优先级：关键/高/普通/低', en: 'CRITICAL / HIGH / NORMAL / LOW' }} /> },
  { value: '0.8 conf', label: <Bilingual content={{ zh: 'LLM 回退置信度阈值', en: 'LLM fallback threshold' }} /> },
];

const CALLOUTS = [
  { label: { zh: '缓存', en: 'Cache' }, value: 'Redis md5 · 3600 s TTL' },
  { label: { zh: '并发', en: 'Workers' }, value: '10 asyncio coroutines' },
  { label: { zh: '超时', en: 'Timeout' }, value: '60 s global guardrail' },
  { label: { zh: '重试', en: 'Retries' }, value: '3× · 0 / 2 / 4 s backoff' },
];

const ARCHITECTURE = [
  {
    titleZh: '意图识别', titleEn: 'Intent Recognition',
    bodyZh: '关键词匹配即时解析熟悉的指令；模糊或新颖的输入才回退到 LLM，在保持语义灵活性的同时压低 P95 延迟。',
    bodyEn: 'Keyword matching resolves familiar commands instantly. Ambiguous or novel input falls through to the LLM, keeping P95 latency low while preserving semantic flexibility.',
  },
  {
    titleZh: '优先级队列引擎', titleEn: 'Priority Queue Engine',
    bodyZh: '四个优先级（CRITICAL → LOW）确保面向用户的响应抢占后台工作；信号量限制并发，防止突发流量下的资源耗尽。',
    bodyEn: 'Four priority levels (CRITICAL → LOW) ensure user-facing responses preempt background work. Semaphore-limited concurrency prevents resource exhaustion under burst traffic.',
  },
  {
    titleZh: '智能体注册表', titleEn: 'Agent Registry',
    bodyZh: 'BaseAgent 抽象将 18 个领域智能体统一在同一契约下。热重载支持不重启协调器即可新增/更新智能体；回退路由优雅处理健康检查失败。',
    bodyEn: 'BaseAgent abstraction unifies 18 domain agents under a single contract. Hot-reload lets you add or update agents without restarting the coordinator; fallback routing handles health failures gracefully.',
  },
  {
    titleZh: '可观测性', titleEn: 'Observability',
    bodyZh: 'Prometheus 指标暴露延迟直方图、队列深度与各智能体成功率。PostgreSQL JSONB 存储结构化的任务与智能体状态，用于审计与回放。',
    bodyEn: 'Prometheus metrics expose latency histograms, queue depth, and per-agent success rates. PostgreSQL JSONB stores structured task and agent state for audit and replay.',
  },
];

export default function JarvisPage() {
  const reduced = useReducedMotion();
  const { locale } = useLocale();

  return (
    <ProjectPage layoutId="project-jarvis" loader={<JarvisLoader />}>
      {/* ── HERO ─────────────────────────────────────────── */}
      <ProjectHeader
        index={meta.index}
        name={<Bilingual content={meta.name} />}
        tagline={<Bilingual content={meta.tagline} />}
      />

      {/* ── METRICS ROW ──────────────────────────────────── */}
      <MetricGrid metrics={METRICS} columns={4} className="mb-20" />

      {/* ── TWO-COLUMN: overview + side callout ──────────── */}
      <motion.div
        className="grid md:grid-cols-[1fr_320px] gap-12 mb-20"
        variants={!reduced ? sectionVariants : undefined}
      >
        {/* Overview */}
        <div className="space-y-4">
          <p className="font-mono text-xs text-gray uppercase tracking-widest mb-2">
            <Bilingual content={{ zh: '概述', en: 'Overview' }} />
          </p>
          <div className="text-lg text-ink leading-relaxed">
            <Bilingual
              content={{
                zh: (
                  <>
                    Jarvis 是一个多智能体协调中枢，将大语言模型的语义理解与复杂任务执行解耦。
                    <span className="text-accent font-mono"> 两阶段意图识别 </span>
                    先运行关键词匹配，只有当置信度低于
                    <span className="font-mono text-accent"> 0.8 </span>
                    时才调用 LLM。
                  </>
                ),
                en: (
                  <>
                    Jarvis is a multi-agent coordination hub that decouples large-language-model
                    semantic understanding from complex task execution. A{' '}
                    <span className="text-accent font-mono">two-stage intent recognition</span>{' '}
                    pipeline runs keyword matching first; the LLM is invoked only when confidence
                    falls below <span className="font-mono text-accent">0.8</span>.
                  </>
                ),
              }}
            />
          </div>
          <p className="text-gray leading-relaxed">
            <Bilingual
              content={{
                zh: 'Redis 语义缓存（md5 键 · TTL 3600 秒）将重复查询延迟缩短一半以上。带 10 个工作协程、信号量 100、60 秒全局超时的 asyncio 优先级队列，在高负载下保持系统容错。',
                en: 'Redis semantic caching (md5 key · TTL 3600 s) cuts repeat-query latency by over half. An asyncio priority queue with 10 workers, semaphore 100, and a 60 s global timeout keeps the system fault-tolerant under load.',
              }}
            />
          </p>
        </div>

        {/* Side callout */}
        <aside className="space-y-4 pt-6 border-t md:border-t-0 md:border-l border-grid md:pl-8">
          {CALLOUTS.map(({ label, value }) => (
            <div key={value}>
              <span className="font-mono text-xs text-gray uppercase tracking-wider">
                <Bilingual content={label} />
              </span>
              <p className="font-mono text-sm text-ink mt-0.5">{value}</p>
            </div>
          ))}
        </aside>
      </motion.div>

      {/* ── ARCHITECTURE DETAILS ─────────────────────────── */}
      <motion.section className="mb-20" variants={!reduced ? sectionVariants : undefined}>
        <p className="font-mono text-xs text-gray uppercase tracking-widest mb-8">
          <Bilingual content={{ zh: '架构', en: 'Architecture' }} />
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {ARCHITECTURE.map(({ titleZh, titleEn, bodyZh, bodyEn }) => (
            <motion.div
              key={titleEn}
              className="border-l-2 border-grid hover:border-accent transition-colors duration-300 pl-6 py-1"
              whileHover={!reduced ? { x: 3 } : undefined}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <h3 className="font-mono text-sm text-accent uppercase tracking-wider mb-2">
                <Bilingual content={{ zh: titleZh, en: titleEn }} />
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                <Bilingual content={{ zh: bodyZh, en: bodyEn }} />
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── FULL MDX CONTENT ─────────────────────────────── */}
      <motion.article
        className="max-w-none mb-20"
        variants={!reduced ? sectionVariants : undefined}
      >
        {locale === 'zh' ? <JarvisMDXZh /> : <JarvisMDX />}
      </motion.article>

      {/* ── TECH STACK ───────────────────────────────────── */}
      <TechStackList
        tags={meta.techTags}
        title={locale === 'zh' ? '技术栈' : 'Tech Stack'}
        className="mb-16"
      />

      {/* ── VALUE STATEMENT ──────────────────────────────── */}
      <motion.div
        className="border-t border-grid pt-8 mt-8"
        variants={!reduced ? sectionVariants : undefined}
      >
        <p className="font-mono text-xs text-gray uppercase tracking-widest mb-3">
          <Bilingual content={{ zh: '价值主张', en: 'Value' }} />
        </p>
        <p className="text-lg text-ink max-w-2xl leading-relaxed">
          <Bilingual
            content={{
              zh: 'Jarvis 将对话式 AI 转化为可靠、可追踪、可溯源的任务执行——一个具备容错调度能力的可扩展能力中枢。',
              en: 'Jarvis turns conversational AI into reliable, trackable, and traceable task execution — an extensible capability hub with fault-tolerant scheduling.',
            }}
          />
        </p>
      </motion.div>
    </ProjectPage>
  );
}
