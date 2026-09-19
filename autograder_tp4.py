#!/usr/bin/env python3
"""
=============================================================================
EVALUADOR AUTOMÁTICO DE TRABAJOS PRÁCTICOS - CÁTEDRA TEORÍA DE SISTEMAS OPERATIVOS
Universidad Nacional de Jujuy (UNJu - Facultad de Ingeniería)
Ciclo Lectivo 2026 | Responsable: Ing. María Fernanda Vázquez | JTP: Ing. Fabio D. Argañaraz
Trabajo Práctico N° 4: Gestión de Recursos e Interbloqueos (Deadlocks)
=============================================================================
"""

import sys
import os
import json
import hashlib
import argparse
from datetime import datetime

# Asegurar compatibilidad UTF-8 en consolas Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

RUBRIC_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rubric_tp4.json")
CATEDRA_SALT = "TSO_UNJu_FI_2026_CatedraVazquez_SecretSalt"

def compute_hash(ex_id, item_key, val):
    clean_val = str(val).strip().lower() if val is not None else ""
    raw = f"{ex_id}:{item_key}:{clean_val}:{CATEDRA_SALT}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()

def load_json(filepath):
    if not os.path.exists(filepath):
        print(f"[ERROR] No se encontró el archivo: {filepath}", file=sys.stderr)
        sys.exit(1)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Error al leer JSON '{filepath}': {e}", file=sys.stderr)
        sys.exit(1)

def grade_submission(submission, rubric):
    student = submission.get("student", {})
    answers = submission.get("answers", {})
    exercises_rubric = rubric.get("exercises", {})
    
    total_score = 0
    max_total_score = rubric.get("max_score", 100)
    exercise_results = {}

    for ex_id, ex_spec in exercises_rubric.items():
        weight = ex_spec.get("weight", 10)
        feedback = ex_spec.get("feedback", "")
        student_ans = answers.get(ex_id, {})

        ex_score = 0
        details = []

        # Formato Seguro (Hashes SHA-256)
        if "hash" in ex_spec:
            expected_hash = ex_spec["hash"]
            student_hash = compute_hash(ex_id, "root", student_ans)
            is_correct = (student_hash == expected_hash)
            if is_correct:
                ex_score = weight
            details.append({
                "item": "Respuesta general",
                "submitted": student_ans,
                "is_correct": is_correct
            })

        elif "hashes" in ex_spec:
            expected_hashes = ex_spec["hashes"]
            total_items = len(expected_hashes)
            correct_items_count = 0

            for item_key, exp_hash in expected_hashes.items():
                actual_val = student_ans.get(item_key) if isinstance(student_ans, dict) else None
                actual_hash = compute_hash(ex_id, item_key, actual_val)
                if isinstance(exp_hash, list):
                    is_correct = (actual_hash in exp_hash)
                else:
                    is_correct = (actual_hash == exp_hash)
                if is_correct:
                    correct_items_count += 1
                details.append({
                    "item": item_key,
                    "submitted": actual_val,
                    "is_correct": is_correct
                })

            if total_items > 0:
                fraction = correct_items_count / total_items
                ex_score = round(fraction * weight, 2)

        # Fallback si se usa rubric_master con respuestas en texto claro
        elif "correct" in ex_spec:
            correct_ans = ex_spec["correct"]
            if isinstance(correct_ans, (str, bool)):
                is_correct = (str(student_ans).strip().lower() == str(correct_ans).strip().lower())
                if is_correct:
                    ex_score = weight
                details.append({
                    "item": "Respuesta general",
                    "submitted": student_ans,
                    "is_correct": is_correct
                })
            elif isinstance(correct_ans, dict):
                total_items = len(correct_ans)
                correct_items_count = 0
                for item_key, expected_val in correct_ans.items():
                    actual_val = student_ans.get(item_key) if isinstance(student_ans, dict) else None
                    if isinstance(expected_val, list):
                        is_correct = str(actual_val).strip().lower() in [str(x).strip().lower() for x in expected_val]
                    else:
                        is_correct = (str(actual_val).strip().lower() == str(expected_val).strip().lower())
                    if is_correct:
                        correct_items_count += 1
                    details.append({
                        "item": item_key,
                        "submitted": actual_val,
                        "is_correct": is_correct
                    })
                if total_items > 0:
                    fraction = correct_items_count / total_items
                    ex_score = round(fraction * weight, 2)

        total_score += ex_score
        exercise_results[ex_id] = {
            "weight": weight,
            "score": ex_score,
            "percentage": round((ex_score / weight) * 100, 1) if weight > 0 else 100,
            "details": details,
            "feedback": feedback
        }

    total_score = round(total_score, 2)
    grade_10 = round((total_score / max_total_score) * 10, 1)

    return {
        "student": student,
        "submission_time": submission.get("tp_metadata", {}).get("submitted_at", datetime.now().isoformat()),
        "total_score": total_score,
        "max_score": max_total_score,
        "grade_scale_10": grade_10,
        "passed": grade_10 >= 4.0,
        "exercise_results": exercise_results
    }

def print_human_report(results):
    student = results["student"]
    print("=" * 75)
    print(" [REPORTE DE EVALUACION] - TEORIA DE SISTEMAS OPERATIVOS (UNJu FI)")
    print("=" * 75)
    print(f" Estudiante:    {student.get('name', 'N/A')}")
    print(f" DNI / Legajo:  {student.get('dni', 'N/A')}")
    if student.get("career"):
        print(f" Carrera/Com.:  {student.get('career')}")
    if student.get("github_user"):
        print(f" Repositorio:   {student.get('github_user')}")
    print(f" Fecha/Hora:    {results['submission_time']}")
    print("-" * 75)
    print(f" CALIFICACION FINAL: {results['total_score']} / {results['max_score']} pts  |  Nota: {results['grade_scale_10']} / 10")
    estado = "APROBADO" if results["passed"] else "DESAPROBADO"
    print(f" Estado: [{estado}]")
    print("=" * 75)
    print(" DESGLOSE DETALLADO POR EJERCICIO:\n")

    ex_titles = {
        "ej1_banquero_necesidad_y_ejecucion": "Ej 1: Algoritmo del Banquero: Matriz Necesidad y Tabla de Ejecución",
        "ej2_condiciones_riesgo_coffman": "Ej 2: Identificación de Riesgos y Condiciones de Coffman",
        "ej3_solicitud_dinamica_p1": "Ej 3: Solicitud Dinámica de P1(0,3,0,0) y Estado Inseguro",
        "ej4_reduccion_grafos_tabla": "Ej 4: Reducción Práctica de Grafos de Asignación",
        "ej5_modelado_rag_matrices": "Ej 5: Modelado a partir del Grafo RAG (Instancia Silberschatz)",
        "ej6_evaluacion_solicitudes_rag": "Ej 6: Evaluación de Solicitudes Dinámicas en RAG Clásico",
        "ej7_deteccion_bloqueos_multi_instancia": "Ej 7: Detección de Bloqueos en Sistemas Multi-Instancia",
        "ej8_recuperacion_seleccion_victima": "Ej 8: Recuperación por Selección de Víctima (Prioridades)",
        "ej9_solicitud_p2_actualizacion": "Ej 9: Solicitud de P2(1,1,0,0) y Actualización Matricial",
        "ej10_estrategias_combinadas_jerarquia": "Ej 10: Estrategias Combinadas y Jerarquía de Recursos"
    }

    for ex_id, res in results["exercise_results"].items():
        title = ex_titles.get(ex_id, ex_id)
        pct = res["percentage"]
        icon = "[OK]" if pct == 100 else ("[PARCIAL]" if pct >= 50 else "[ERROR]")
        print(f" {icon} {title}")
        print(f"      Puntaje: {res['score']} / {res['weight']} pts ({pct}%)")
        
        failed_items = [d for d in res["details"] if not d["is_correct"]]
        if failed_items:
            print(f"      Ítems con discrepancia: {len(failed_items)} de {len(res['details'])}")
            for fi in failed_items[:4]:
                print(f"         • Revisar celda/ítem '{fi['item']}'")
            if len(failed_items) > 4:
                print(f"         • ... y {len(failed_items)-4} más.")
        
        if pct < 100:
            print(f"      📚 Guía Bibliográfica: {res['feedback']}")
        print()

    print("=" * 75)
    print(" Cátedra Teoría de Sistemas Operativos — UNJu Facultad de Ingeniería 2026")
    print("=" * 75)

def write_github_step_summary(results):
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return
    try:
        student = results.get("student", {})
        passed = results.get("passed", False)
        status_badge = "✅ APROBADO" if passed else "❌ REQUIERE REVISIÓN"
        
        lines = [
            "# 🎓 Reporte de Autoevaluación - Cátedra Teoría de Sistemas Operativos",
            "### Trabajo Práctico N° 4: Gestión de Recursos e Interbloqueos (Deadlocks)",
            "",
            f"**Estado:** {status_badge} | **Calificación:** `{results['total_score']} / {results['max_score']} pts` ({results['grade_scale_10']}/10)",
            "",
            f"- **Estudiante:** {student.get('name', 'N/A')}",
            f"- **DNI / Legajo:** {student.get('dni', 'N/A')}",
            f"- **Carrera:** {student.get('career', 'N/A')}",
            f"- **Usuario GitHub:** {student.get('github_user', 'N/A')}",
            f"- **Fecha:** {results.get('submission_time', 'N/A')}",
            "",
            "### 📊 Detalle por Ejercicio",
            "",
            "| Ejercicio | Puntos Obtenidos | Máx | Estado | Bibliografía / Feedback |",
            "| :--- | :---: | :---: | :---: | :--- |"
        ]
        
        for ex_id, res in results.get("exercise_results", {}).items():
            if res["score"] == res["weight"]:
                st = "✅ Correcto"
                fb = "—"
            elif res["score"] > 0:
                st = f"⚠️ Parcial ({res['percentage']}%)"
                fb = res.get("feedback", "Revisar conceptos.")
            else:
                st = "❌ Discrepancia"
                fb = res.get("feedback", "Revisar conceptos.")
            lines.append(f"| `{ex_id}` | **{res['score']}** | {res['weight']} | {st} | {fb} |")
        
        lines.append("")
        if not passed:
            lines.append("> [!WARNING]")
            lines.append("> **Tu entrega aún no alcanza los criterios de aprobación.** Consulta los capítulos bibliográficos indicados en la tabla superior, abre `index.html` para ajustar tus respuestas, exporta un nuevo `respuestas_tp4.json` y vuelve a hacer `git push origin main`.")
        else:
            lines.append("> [!TIP]")
            lines.append("> **¡Felicitaciones!** Has resuelto y aprobado satisfactoriamente los ejercicios de este Trabajo Práctico.")
            
        with open(summary_path, 'a', encoding='utf-8') as f:
            f.write("\n".join(lines) + "\n")
    except Exception as e:
        print(f"[WARN] No se pudo escribir GITHUB_STEP_SUMMARY: {e}", file=sys.stderr)

def main():
    parser = argparse.ArgumentParser(description="Autograder para TP4 - Cátedra TSO UNJu")
    parser.add_argument("submission", help="Ruta al archivo respuestas_tp4.json")
    parser.add_argument("--rubric", default=RUBRIC_FILE, help="Ruta a rubric_tp4.json")
    parser.add_argument("--json", action="store_true", help="Emitir resultados en JSON")
    
    args = parser.parse_args()

    rubric_path = args.rubric
    if not os.path.exists(rubric_path):
        alt_master = os.path.join(os.path.dirname(rubric_path), "rubric_tp4_master.json")
        if os.path.exists(alt_master):
            rubric_path = alt_master

    submission = load_json(args.submission)
    rubric = load_json(rubric_path)

    results = grade_submission(submission, rubric)

    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
    else:
        print_human_report(results)

    write_github_step_summary(results)

    sys.exit(0 if results["passed"] else 1)

if __name__ == "__main__":
    main()
