import { TeamPerformanceSection } from "./components/TeamPerformanceSection";
import { RecruiterGroupCard } from "./components/RecruiterGroupCard";
import { RecruitersTable } from "./components/RecruitersTable";
import { ProcessEfficiencyPanel } from "./components/ProcessEfficiencyPanel";
import { RealTimeStats } from "./components/RealTimeStats";
import { TeamFilters } from "./components/TeamFilters";
import { RECRUITER_GROUPS } from "./data";
import { ReportsPeriodProvider } from "./ReportsPeriodContext";
import styles from "./ReportsPage.module.css";

export function ReportsPage() {
  return (
    <ReportsPeriodProvider>
      <div className={styles.page}>
        <section className={styles.section} aria-labelledby="real-time-data">
          <div className={styles.sectionHeader}>
            <h1 id="real-time-data" className={styles.sectionTitle}>
              Real Time Data
            </h1>
            <span className={styles.meta}>Last read 2 mins ago</span>
          </div>
          <RealTimeStats />
        </section>

        <hr className={styles.divider} />

        {/* Everything below follows the Talent and Period filters. */}
        <section className={styles.section} aria-labelledby="historical-performance">
          <div className={styles.sectionHeader}>
            <h2 id="historical-performance" className={styles.sectionTitle}>
              Historical Performance
            </h2>
            <TeamFilters />
          </div>

          <div className={styles.sections}>
            <ProcessEfficiencyPanel />

            <TeamPerformanceSection />

            <div className={styles.group}>
              <div className={`${styles.row} ${styles.alignStart}`}>
                {RECRUITER_GROUPS.map((group) => (
                  <RecruiterGroupCard key={group.id} {...group} />
                ))}
              </div>
              <RecruitersTable />
            </div>
          </div>
        </section>
      </div>
    </ReportsPeriodProvider>
  );
}
