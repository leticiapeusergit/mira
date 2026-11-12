import { AlertCard } from "./components/AlertCard";
import { KpiCard } from "./components/KpiCard";
import { VacanciesCard } from "./components/VacanciesCard";
import { RecruiterGroupCard } from "./components/RecruiterGroupCard";
import { RecruitersTable } from "./components/RecruitersTable";
import { HiringFunnel } from "./components/HiringFunnel";
import { StageConversion } from "./components/StageConversion";
import { TeamFilters } from "./components/TeamFilters";
import { ALERTS, KPIS, RECRUITER_GROUPS } from "./data";
import styles from "./ReportsPage.module.css";

export function ReportsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Reports</h1>
      </header>

      <section className={styles.section} aria-labelledby="team-performance">
        <div className={styles.sectionHeader}>
          <h2 id="team-performance" className={styles.sectionTitle}>
            Team Performance
          </h2>
          <TeamFilters />
        </div>

        <div className={styles.row}>
          {ALERTS.map((alert) => (
            <AlertCard key={alert.title} {...alert} />
          ))}
        </div>

        <div className={styles.row}>
          {KPIS.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>

        <VacanciesCard />
      </section>

      <section className={styles.section} aria-labelledby="recruiter-performance">
        <div className={styles.sectionHeader}>
          <h2 id="recruiter-performance" className={styles.sectionTitle}>
            Recruiter Performance
          </h2>
        </div>

        <div className={`${styles.row} ${styles.alignStart}`}>
          {RECRUITER_GROUPS.map((group) => (
            <RecruiterGroupCard key={group.title} {...group} />
          ))}
        </div>

        <RecruitersTable />

        <div className={styles.row}>
          <HiringFunnel />
          <StageConversion />
        </div>
      </section>
    </div>
  );
}
