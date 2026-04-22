import { Scores } from '../App'

/**
 * 根据分值计算 MBTI 结果字符串
 * @param scores 计分对象
 * @param isDeep 是否为包含第 5 维度的深度测试
 * @returns 4位或5位 MBTI 字符串 (如 ENFP 或 ENFP-T)
 */
export const calculateMBTIResult = (scores: Scores, isDeep: boolean = false): string => {
  const E_or_I = scores.E > scores.I ? 'E' : 'I';
  const S_or_N = scores.S > scores.N ? 'S' : 'N';
  const T_or_F = scores.T > scores.F ? 'T' : 'F';
  const J_or_P = scores.J > scores.P ? 'J' : 'P';
  
  let result = `${E_or_I}${S_or_N}${T_or_F}${J_or_P}`;
  
  if (isDeep) {
    const A_or_T = scores.A > scores.T_ ? 'A' : 'T';
    result = `${result}-${A_or_T}`;
  }
  
  return result;
};

/**
 * 随机模拟生成测试结果 (调试用)
 */
export const generateRandomScores = (questions: any[]): Scores => {
  const randomScores: Scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, A: 0, T_: 0 };
  questions.forEach(q => {
    const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
    randomScores[randomOption.dimension as keyof Scores] += randomOption.weight;
  });
  return randomScores;
};
