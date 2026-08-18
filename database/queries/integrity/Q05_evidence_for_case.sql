-- Q05: All evidence belonging to one case
SELECT
    e.case_id,
    e.evidence_no,
    e.description,
    e.collected_date
FROM evidence e
WHERE e.case_id = 5002
ORDER BY e.evidence_no;