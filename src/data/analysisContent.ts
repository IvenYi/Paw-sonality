import { Scores } from '../App';

// 灵魂韧性 (-A vs -T) 的深度解析
export const SOUL_RESILIENCE_CONTENT = {
  'A': {
    title: '稳如泰山的内核',
    sub: 'Soul Resilience: Assertive',
    desc: '在动物行为学中，-A 意味着极高的情绪稳定性。它不仅是一只宠物，更是家里的“定海神针”。无论你是在深夜加班还是情绪崩溃，它都能保持那种淡定而松弛的状态，用一种“万事有我”的气场，悄悄抚平你的精神内耗。',
    advice: '它不需要过度的情绪补偿，更需要一个能陪它一起静坐、感受当下的稳健伙伴。'
  },
  'T': {
    title: '极其细腻的灵魂',
    sub: 'Soul Resilience: Turbulent',
    desc: '它是一个天生的“情感海绵”，对环境和你的情绪变化有着近乎玄学的感知力。-T 代表了它敏感的神经和丰富的内心戏。它有时表现出的“一惊一乍”或“过度粘人”，其实是在努力确认自己是否还被你深深爱着。',
    advice: '请给它更多的“确定性”和身体接触，你的一个眼神反馈就是它对抗世界焦虑的唯一良药。'
  }
};

// 关系标签生成逻辑
export const getRelationshipLabel = (petMBTI: string, ownerMBTI: string) => {
  const p = petMBTI.substring(0, 4);
  const o = ownerMBTI.substring(0, 4);
  
  let diff = 0;
  for (let i = 0; i < 4; i++) if (p[i] !== o[i]) diff++;

  if (diff <= 1) return { tag: '平行时空的双胞胎', desc: '你们共享同一种灵魂频率，是跨越物种的倒影。' };
  if (diff >= 3) return { tag: '融化冰山的火火', desc: '截然不同的性格，却像拼图一样严丝合缝地嵌入彼此的生活。' };
  if (o.includes('I') && p.includes('E')) return { tag: '社恐大人的强力充电宝', desc: '它是你连接喧嚣世界的唯一窗户。' };
  if (o.includes('P') && p.includes('J')) return { tag: '散漫大人的严厉小管家', desc: '在这个家里，到底谁才是说了算的那个？' };
  if (o.includes('T') && p.includes('F')) return { tag: '理性大脑的情感软肋', desc: '它用不讲道理的爱，击穿了你所有的逻辑。' };
  
  return { tag: '相爱相杀的欢喜冤家', desc: '在打打闹闹中，确认过眼神，是这辈子逃不掉的人。' };
};

// 深度契合分析 (16x16 核心逻辑碎片)
export const getDeepSyncAnalysis = (petMBTI: string, ownerMBTI: string) => {
  const isOwnerIntrovert = ownerMBTI.includes('I');
  const isPetExtravert = petMBTI.includes('E');
  
  if (isOwnerIntrovert && isPetExtravert) {
    return "当你结束一天的社交，筋疲力尽地回到家时，它那毫无保留的扑跳并不是干扰，而是一种心理学上的“去抑制”治疗。作为内向者的你习惯隐藏情绪，而它作为外向型宠物，在扮演那个替你表达热情的角色。它在闹，你在笑，这就是你们最稳固的生态位。";
  }
  
  if (ownerMBTI.includes('T') && petMBTI.includes('F')) {
    return "你习惯用逻辑拆解世界，而它习惯用直觉感知世界。在动物行为学看来，它是你理智生活里的“降噪器”。你试图分析它为什么拆家，它却只是想让你放下手机看看它。这种冲突感正是你们关系的魅力所在：它教会了你，爱是不需要逻辑的。";
  }

  return "你们的关系像是一场无声的心理共振。你们在彼此身上寻找着自己缺失的那部分——也许是那份敢于直面冲突的勇气，也许是那份安于现状的宁静。不需要刻意经营，那种只需一个眼神就能达成的默契，就是你们性格矩阵里的最优解。";
};

// 宠物的情书逻辑
export const getLetterToOwner = (petType: 'dog' | 'cat', mbti5: string) => {
  const isT = mbti5.endsWith('-T');
  if (petType === 'dog') {
    return isT 
      ? "我知道我偶尔会因为一点声音就吓得往你怀里钻，那是因为我把所有的防备都卸下了，只留给最信任的你。谢谢你从来不嫌弃我的小胆怯，我会用一辈子来报答你的温柔。"
      : "我可能看起来总是没心没肺，但我的快乐全是因为你在身边。只要你回头，我永远都在摇着尾巴等你，因为你就是我的全世界。";
  } else {
    return isT
      ? "我偶尔的躲藏和那点小心思，其实只是想确认你还一直在意我。我比较慢热，心也比较小，只装得下一个你，谢谢你愿意等我慢慢向你敞开心扉。"
      : "我不太擅长表达爱，但我会在半夜压住你的被角，会在你回家时假装不在意地路过。我的世界很大，但我只想和你在这个小家里，虚度时光。";
  }
};
