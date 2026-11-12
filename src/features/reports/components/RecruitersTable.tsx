import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Tag } from "@/components/ui/Tag";
import { CELL_HISTORY, RECRUITER_COLUMNS, RECRUITER_ROWS } from "../data";
import styles from "./RecruitersTable.module.css";

export function RecruitersTable() {
  return (
    <Card className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.nameCol}>
              Name
            </th>
            {RECRUITER_COLUMNS.map((col) => (
              <th key={col.key} scope="col" className={col.key === "present" ? styles.presentCol : undefined}>
                {col.label}
                {col.target && <span className={styles.target}>{col.target}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RECRUITER_ROWS.map((row) => (
            <tr key={row.name}>
              <th scope="row" className={styles.nameCol}>
                <span className={styles.person}>
                  <img src={row.avatar} alt="" width={32} height={32} className={styles.avatar} />
                  {row.name}
                </span>
              </th>
              {RECRUITER_COLUMNS.map((col) => {
                const metric = row[col.key];
                const headline = metric.detail ?? `${col.label} ${metric.value}`;
                return (
                  <td key={col.key}>
                    <HoverCard
                      label={`${row.name} · ${headline}`}
                      content={
                        <HistoryCard
                          value={headline}
                          trend={metric.trend ?? { direction: "up", text: "+2% vs. prev" }}
                          {...CELL_HISTORY}
                        />
                      }
                    >
                      <Tag tone={metric.tone}>{metric.value}</Tag>
                    </HoverCard>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
