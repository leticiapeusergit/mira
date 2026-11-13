import { TeamPerformanceSection } from "./components/TeamPerformanceSection";
import { RecruiterGroupCard } from "./components/RecruiterGroupCard";
import { RecruitersTable } from "./components/RecruitersTable";
import { HiringFunnel } from "./components/HiringFunnel";
import { StageConversion } from "./components/StageConversion";
import { ProcessEfficiencyPanel } from "./components/ProcessEfficiencyPanel";
import { RECRUITER_GROUPS } from "./data";
import { ReportsPeriodProvider } from "./ReportsPeriodContext";
import styles from "./ReportsPage.module.css";

export function ReportsPage() {
  return (
    <ReportsPeriodProvider>
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Reports</h1>
      </header>

      <div className={styles.sections}>
        <ProcessEfficiencyPanel />

        <TeamPerformanceSection />

        <section className={styles.section} aria-labelledby="recruiter-performance">
          <div className={styles.sectionHeader}>
            <h2 id="recruiter-performance" className={styles.sectionTitle}>
              Recruiter Performance
            </h2>
          </div>

          <div className={`${styles.row} ${styles.alignStart}`}>
            {RECRUITER_GROUPS.map((group) => (
              <RecruiterGroupCard key={group.id} {...group} />
            ))}
          </div>

          <RecruitersTable />

          <div className={styles.row}>
            <HiringFunnel />
            <StageConversion />
          </div>
        </section>
      </div>
    </div>
    </ReportsPeriodProvider>
  );
}
