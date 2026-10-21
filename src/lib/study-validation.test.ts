import { describe, expect, test } from 'bun:test';
import { exerciseInput, validateQuestions, onboardingSchema } from './study-validation';
const question = (n: number) => ({ context: '', question: `Questão ${n}`, options: ['1','2','3','4','5'], answer: 0, explanation: 'Explicação' });
describe('exercícios solicitados', () => {
 test('mantém matéria e assunto escritos', () => { const input = exerciseInput.parse({ subject: 'Biologia', topic: 'Mitose e meiose', difficulty: 'Médio', count: 3 }); expect(input.subject).toBe('Biologia'); expect(input.topic).toBe('Mitose e meiose'); });
 test('exige exatamente 3 questões quando pedidas', () => { expect(validateQuestions([question(1),question(2),question(3)],3)).toHaveLength(3); expect(() => validateQuestions([question(1)],3)).toThrow(); });
 test('exige 5 alternativas estilo ENEM', () => { expect(() => validateQuestions([{ ...question(1), options: ['a','b','c','d'] }],1)).toThrow(); });
 test('recusa questões repetidas', () => expect(() => validateQuestions([question(1),question(1)],2)).toThrow());
 test('recusa respostas fora de A a E', () => expect(() => validateQuestions([{ ...question(1), answer: 5 }],1)).toThrow());
 test('cronograma exige dias e horário disponíveis', () => { const data = { grade:'3º ano EM',goal:'Passar no ENEM',exam:'ENEM',exam_date:'3 a 6 meses',strong_subjects:['Biologia'],weak_subjects:['Matemática'],hours_per_day:'1 a 2h',study_days:['Seg','Qua'],study_start:'19:00' }; expect(onboardingSchema.parse(data).study_days).toEqual(['Seg','Qua']); expect(() => onboardingSchema.parse({...data,study_days:[]})).toThrow(); expect(() => onboardingSchema.parse({...data,study_start:'29:00'})).toThrow(); });
});
