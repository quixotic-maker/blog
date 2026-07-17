'use client';

import { motion } from 'framer-motion';
import { ProjectPage, sectionVariants } from '@/components/project/ProjectPage';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { MetricGrid } from '@/components/project/MetricGrid';
import { TechStackList } from '@/components/project/TechStackList';
import { ExplodedViewMotif } from '@/components/project/ExplodedViewMotif';
import { ArfLoader } from '@/components/project/ProjectLoaders';
import { Bilingual } from '@/components/ui/Bilingual';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { projectsMeta } from '@/content/projectsMeta';
import ArfContent from '@/content/projects/arf.mdx';
import ArfContentZh from '@/content/projects/arf.zh.mdx';

const meta = projectsMeta[2];

const METRICS = [
  { value: '1kHz', label: <Bilingual content={{ zh: '实时调度频率', en: 'Real-time scheduling' }} /> },
  { value: 'jitter<100μs', label: <Bilingual content={{ zh: '调度抖动上界', en: 'Scheduling jitter' }} /> },
  { value: 'PREEMPT_RT', label: <Bilingual content={{ zh: '实时内核', en: 'Real-time kernel' }} /> },
  { value: '6 layers', label: <Bilingual content={{ zh: '边缘侧架构层级', en: 'Edge-plane layers' }} /> },
];

const EDGE_LAYERS = [
  { id: 'HAL', descZh: '基于 gRPC 的驱动即服务 · Rust/C++ 崩溃隔离', descEn: 'Drivers-as-service over gRPC · Rust/C++ crash isolation' },
  { id: 'RTS', descZh: '无锁 SPSC 队列 · 1kHz · 抖动<100μs · PREEMPT_RT', descEn: 'Lock-free SPSC queue · 1kHz · jitter<100μs · PREEMPT_RT' },
  { id: 'DMS', descZh: 'Redis/ZeroMQ 发布订阅 · 环形缓冲记录器 · Parquet 同步', descEn: 'Redis/ZeroMQ pub-sub · ring-buffer recorder · Parquet sync' },
  { id: 'ACR', descZh: 'Go 运行时 + Python DAG · 零拷贝共享内存', descEn: 'Go runtime + Python DAG · zero-copy shared memory' },
  { id: 'DIL', descZh: '世界模型 · py_trees · 安全监控器 · LLM 规划器', descEn: 'World model · py_trees · safety monitor · LLM planner' },
  { id: 'App', descZh: 'FastAPI + React 应用层', descEn: 'FastAPI + React application layer' },
];

export default function ArfProjectPage() {
  const reduced = useReducedMotion();
  const { locale } = useLocale();

  return (
    <ProjectPage layoutId="project-arf" loader={<ArfLoader />}>
      <ProjectHeader
        index={meta.index}
        name={<Bilingual content={meta.name} />}
        tagline={<Bilingual content={meta.tagline} />}
      />

      {/* Signature motif */}
      <motion.div className="mb-20" variants={!reduced ? sectionVariants : undefined}>
        <ExplodedViewMotif />
      </motion.div>

      <MetricGrid metrics={METRICS} columns={4} className="mb-20" />

      {/* ── EDGE-PLANE LAYERS ────────────────────────────── */}
      <motion.section className="mb-20" variants={!reduced ? sectionVariants : undefined}>
        <p className="font-mono text-xs text-gray uppercase tracking-widest mb-8">
          <Bilingual content={{ zh: '边缘侧架构层级', en: 'Edge-Plane Architecture' }} />
        </p>
        <div className="space-y-px border border-grid">
          {EDGE_LAYERS.map(({ id, descZh, descEn }, i) => (
            <motion.div
              key={id}
              className="flex items-start gap-6 bg-paper hover:bg-grid/30 transition-colors duration-300 px-6 py-4"
              initial={!reduced ? { opacity: 0, x: -12 } : undefined}
              whileInView={!reduced ? { opacity: 1, x: 0 } : undefined}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-mono text-xs text-accent uppercase tracking-wider w-10 flex-shrink-0 pt-0.5">
                L{i}
              </span>
              <span className="font-display font-bold text-ink w-16 flex-shrink-0">{id}</span>
              <span className="font-mono text-xs text-gray leading-relaxed">
                <Bilingual content={{ zh: descZh, en: descEn }} />
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── DIL COMPOSABLE DECISION ──────────────────────── */}
      <motion.section className="mb-20" variants={!reduced ? sectionVariants : undefined}>
        <p className="font-mono text-xs text-gray uppercase tracking-widest mb-8">
          <Bilingual content={{ zh: 'DIL 三层可组合决策', en: 'DIL Composable Decision' }} />
        </p>
        <div className="grid md:grid-cols-3 gap-px bg-grid border border-grid">
          {[
            {
              level: 'L1', titleEn: 'Atomic Capabilities', titleZh: '原子能力',
              bodyEn: 'Algorithm containers (ACR) as primitive building blocks.',
              bodyZh: 'ACR 容器中的算法原语。',
            },
            {
              level: 'L2', titleEn: 'Composable Components', titleZh: '可组合组件',
              bodyEn: 'Behavior tree manager · Vision search · Safety monitor',
              bodyZh: '行为树管理器 · 视觉搜索 · 安全监控器',
            },
            {
              level: 'L3', titleEn: 'Decision Instances', titleZh: '完整决策实例',
              bodyEn: 'Developer-assembled complete decision pipelines.',
              bodyZh: '开发者组装的完整决策流水线。',
            },
          ].map(({ level, titleEn, titleZh, bodyEn, bodyZh }) => (
            <div key={level} className="bg-paper p-6 hover:bg-grid/30 transition-colors duration-300">
              <span className="font-mono text-xs text-accent tracking-widest">{level}</span>
              <h3 className="font-display font-bold text-ink mt-1 mb-2">
                <Bilingual content={{ zh: titleZh, en: titleEn }} />
              </h3>
              <p className="font-mono text-xs text-gray leading-relaxed">
                <Bilingual content={{ zh: bodyZh, en: bodyEn }} />
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── FULL MDX CONTENT ─────────────────────────────── */}
      <motion.article
        className="max-w-none mb-20"
        variants={!reduced ? sectionVariants : undefined}
      >
        {locale === 'zh' ? <ArfContentZh /> : <ArfContent />}
      </motion.article>

      <TechStackList
        tags={meta.techTags}
        title={locale === 'zh' ? '技术栈' : 'Tech Stack'}
        className="mb-16"
      />

      {/* ── VALUE ────────────────────────────────────────── */}
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
              zh: 'ARF 解决机器人领域的根本碎片化问题，提供标准化通用控制框架与生态基础。',
              en: 'ARF solves fragmentation in robotics by providing a standardized universal control framework and ecosystem foundation.',
            }}
          />
        </p>
      </motion.div>
    </ProjectPage>
  );
}
