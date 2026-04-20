import { motion } from 'framer-motion'
import { RotateCcw, Lock, Heart, CheckCircle2, Quote, Share2, PawPrint, BookOpen } from 'lucide-react'
import { useState } from 'react'
import html2canvas from 'html2canvas'

interface ResultPageProps {
  result: string
  petType: 'dog' | 'cat'
  onReset: () => void
}

const dogResults: Record<string, { title: string, summary: string }> = {
  ENFP: { title: "天生的快乐小狗 / 社牛天花板", summary: "你的狗狗就像一个小太阳，永远充满着对世界的好奇和对你的热爱。在它眼里，你不仅是主人，更是它在这个星球上唯一的超级英雄。它或许偶尔会调皮捣蛋，但这都是因为它有着无处安放的旺盛精力。每当你难过时，它总能第一时间感知到，用它毛茸茸的脑袋蹭走你的所有烦恼。请好好珍惜这只用尽全力在爱你的修勾吧！" },
  ENTP: { title: "满脑子鬼点子的捣蛋鬼 / 拆家战神", summary: "这只狗狗的脑回路简直是个迷！它聪明绝顶，总能找到你藏起来的零食，也总能想出一百种方法引起你的注意。它对这个世界有着无穷的探索欲，家里的每一个角落都是它的游乐场。虽然有时候它的小聪明会让你哭笑不得，但正是这种鲜活的生命力，给你的生活带来了最意想不到的惊喜与快乐。" },
  INFP: { title: "敏感又温柔的治愈系天使 / 专属小棉袄", summary: "它心思细腻，甚至带点小忧郁。它不太喜欢喧闹的狗公园，只喜欢安安静静地趴在你的脚边。它能读懂你的每一次叹气，在你疲惫时默默靠过来给你最坚实的依靠。它也许对外人有些警惕，但把所有的温柔和毫无保留的信任都给了你一人。拥有它，就像拥有了一个永远不会离开你的灵魂伴侣。" },
  INTP: { title: "看透一切的狗界哲学家 / 高冷局外狗", summary: "这绝对是一只自带“老灵魂”的狗狗。它不屑于为了讨好而做一些傻乎乎的动作，更多时候，它喜欢趴在窗边静静地观察这个世界。它极其聪明且独立，有着自己的小宇宙和思考逻辑。虽然它看起来不那么黏人，但只要你需要，它总会在不远处默默地守望着你，用它独有的高冷方式深爱着你。" },
  ENFJ: { title: "充满爱意的全区居委会主任 / 护主狂魔", summary: "它简直是狗界的“暖心小天使”代表！天生自带强烈的责任感和保护欲，不仅操心你的起居，连你在路上遇到的人它都要严格审查一番。它极度需要你的关注和夸奖，只要你开心，它愿意为你做任何事。这份沉甸甸的、毫无保留的爱意，是它能给你最珍贵的礼物。" },
  ENTJ: { title: "威风凛凛的巡逻大队长 / 霸道总裁", summary: "气场全开，自信满满！它走在路上总是昂首挺胸，仿佛整个小区都在它的管辖之下。它精力充沛、执行力极强，对于扔飞盘或巡回游戏有着刻在骨子里的执着。虽然偶尔会有点小倔强，想要自己做主，但在它霸气的外表下，其实藏着一颗只对你臣服、渴望被你肯定的心。" },
  INFJ: { title: "洞察人心的沉默守护者 / 灵魂伴侣", summary: "它似乎拥有某种神奇的第六感，总是能在你最脆弱的时候准时出现。它不需要你用言语发号施令，只需一个眼神，它就能读懂你的心思。它安静、神秘、极度忠诚，比起喧闹的环境，它更享受和你单独呆在安静的房间里。它是你最忠实的倾听者，也是你内心最柔软的避风港。" },
  INTJ: { title: "极度自律的战术大师 / 莫得感情的干饭机", summary: "这只狗狗的作息规律得可怕，像是一个严格执行代码的程序。它对生活有着极高的要求，不论是吃饭的点还是睡觉的窝，都容不得半点马虎。它聪明、冷静，甚至有点小孤傲。不要试图用幼稚的游戏糊弄它，它只欣赏真正有挑战性的互动。虽然看似高冷，但它对这个家的忠诚度绝对是无可挑剔的。" },
  ESFP: { title: "走到哪嗨到哪的人来疯 / 首席气氛组", summary: "有它在的地方，绝对充满了欢声笑语！它是一只为了舞台而生的狗狗，无论走到哪里都能迅速成为全场焦点。它极其容易满足，一片落叶、一个空瓶子都能让它开心半天。它的快乐是极具传染力的，只要看着它无忧无虑地奔跑，你一天的疲惫都会瞬间烟消云散。" },
  ESTP: { title: "胆大包天的冒险家 / 极限运动狂", summary: "这只狗狗的字典里没有“害怕”两个字！它勇敢、果断，对一切未知的事物都充满了挑战欲。普通的散步根本满足不了它，它需要的是奔跑、跳跃和探索。它总是冲在最前面，像个无所畏惧的小战士。带它出门，你永远不用担心无聊，因为它会把你原本平静的生活变成一场场精彩的冒险。" },
  ISFP: { title: "随遇而安的佛系甜心 / 情绪稳定的慢性子", summary: "它是真正的“脾气超好”代表。无论你怎么揉捏它，它总是一副慢吞吞、随遇而安的佛系模样。它不争不抢，对吃喝玩乐都没有极端的执念，只求一个舒服的角落和你的陪伴。在这个快节奏的时代，它就像一杯温和的甘菊茶，用它那独有的松弛感，慢慢抚平你内心的焦虑。" },
  ISTP: { title: "闷声干大事的独行侠 / 酷盖本盖", summary: "这是一只不需要太多言语的实干派狗狗。它动手能力极强，总是能在不经意间学会开门、开抽屉等高难度动作。它不黏人，有自己的小天地，喜欢独自研究那些让它好奇的事物。它虽然不喜欢热烈的拥抱，但那种不动声色、默默趴在你脚边的陪伴，同样充满力量。" },
  ESFJ: { title: "热心肠的汪星大管家 / 操心大王", summary: "家里的风吹草动都逃不过它的眼睛！它极度渴望参与到家庭的每一项活动中，哪怕你只是去上个厕所它都要跟着。它非常在乎你的情绪反馈，一句轻声的责备就能让它伤心好久。它就像一个永远长不大的孩子，用它那甚至有些笨拙的热情，努力维持着这个家的温暖与欢乐。" },
  ESTJ: { title: "严守规矩的铁面保安 / 打卡标兵", summary: "纪律和秩序是它生命的主旋律。它非常聪明且易于训练，一旦学会了规矩就会严格遵守。它对待“看家护院”这份工作极其认真，任何风吹草动都会立刻向你汇报。它可能不太擅长撒娇卖萌，但它那份刻在骨子里的忠诚和责任感，能给你带来无与伦比的安全感。" },
  ISFJ: { title: "默默陪伴的忠诚卫士 / 温柔大后盾", summary: "它可能不是最惹眼的那一个，但绝对是最贴心、最长情的那一个。它性格温顺、隐忍，极少提出无理的要求。它把保护你和这个家视为自己毕生的使命，即使面临危险也会毫不犹豫地挡在你身前。它那双总是湿漉漉、充满深情的眼睛里，装满了对你毫无保留的信任与爱意。" },
  ISTJ: { title: "充满原则的汪星老干部 / 稳如泰山", summary: "这是一只极度靠谱、情绪极其稳定的狗狗。它不喜欢意外和改变，只要每天能按时吃饭、按时遛弯，它就觉得这是最完美的一天。它性格沉稳，不会一惊一乍，给人一种非常踏实的感觉。在这个瞬息万变的世界里，它像一块永远坚固的基石，让你知道无论发生什么，它都会在家里安静地等你回来。" }
};

const catResults: Record<string, { title: string, summary: string }> = {
  ENFP: { title: "社交满分的夹子音甜心 / 职业撒娇精", summary: "你家主子简直是个披着猫皮的“小狗”！它对这个家充满了旺盛的探索欲，哪里有动静就必须要去凑个热闹。它极其擅长利用夹子音和无辜的大眼睛对你进行软磨硬泡，精准拿捏你的软肋。虽然它有时候黏人到让你无法正常走路，但每当你回到家，看到它飞奔过来求抱抱的模样，一天的疲惫都会瞬间被治愈。" },
  ENTP: { title: "不按套路出牌的跑酷王 / 叛逆修仙党", summary: "这只猫咪的脑回路根本无法用人类的逻辑来解释。它聪明绝顶，总能轻易破解你藏零食的机关。它精力充沛，热衷于在半夜两点开启极限跑酷模式，把你家当成它的私人游乐场。它时而高冷，时而像个逗比，永远不按套路出牌。虽然它经常惹你生气，但它那鲜活而自由的灵魂，也是你最无法抗拒的魅力。" },
  INFP: { title: "玻璃心的忧郁小猫咪 / 专属嘤嘤怪", summary: "它是一只心思极其细腻、共情能力满分的小猫。它有点胆小，面对陌生环境或陌生人时总会立刻隐身。但对你，它有着毫无保留的依赖。它似乎能听懂你的心事，在你难过时默默趴在你手边陪着你。它需要你温柔的呵护和大量的耐心，而作为回报，它会将全部的爱意和信任都倾注在你一个人身上。" },
  INTP: { title: "看透宇宙的暗中观察员 / 思考者", summary: "这是一只拥有“老灵魂”的高智商猫咪。它不屑于像其他猫那样为了一个塑料袋疯狂扑腾，更多的时候，它喜欢蹲在猫爬架的最高处，用一种“审视愚蠢人类”的眼神静静地观察你。它独立、冷静，有着极强的领地意识和自己的生活节奏。不要试图强迫它营业，它只会用那份独有的、若即若离的高冷来回应你的爱。" },
  ENFJ: { title: "极度操心的喵星管家 / 行走的监控探头", summary: "它简直是这个家的“大家长”！不仅操心自己的饭盆，连你去洗澡它都要蹲在门口焦虑地守着，生怕你被水淹死。它极其需要互动，只要你一开口叫它，它就会立刻用清脆的喵喵声回应你。它那份略带霸道但又无微不至的关心，让你深刻体会到“被一只猫深深需要”的幸福感。" },
  ENTJ: { title: "统领全家的高傲巡视员 / 唯我独尊", summary: "气场一米八的真·主子！它在家走起路来总是迈着自信优雅的步伐，仿佛在巡视自己的江山。它有着强烈的掌控欲，必须知道家里发生的一切事情。对于不喜欢的食物或玩具，它会极其明确地表达出嫌弃。虽然它看起来霸道傲娇，但只要你心甘情愿地臣服于它，它也会在心情好时，赏赐你片刻的温柔。" },
  INFJ: { title: "神秘莫测的灵魂预言家 / 高级感拿捏了", summary: "它就像一只从古老传说中走出来的神秘精灵。它总是安静地待在角落，眼神深邃，似乎洞悉着某种人类无法理解的秘密。它极其敏感，能捕捉到空气中最微小的情绪波动。它不会轻易向任何人敞开心扉，但只要它认定了你，它就会用最轻柔的呼噜声和最温柔的蹭蹭，给予你最高级别的、灵魂深处的治愈。" },
  INTJ: { title: "运筹帷幄的冷酷杀手 / 莫得感情", summary: "这是一只极度自律且目标明确的猫咪。它无论是捕猎（玩逗猫棒）还是干饭，都追求一击致命的效率，绝不拖泥带水。它讨厌拥抱和过度的亲昵，极其重视个人的私人空间。它聪明得让人害怕，总能精准找到最舒服的角落或最容易得手的零食。它用一种近乎冷酷的理智，完美诠释了什么是真正的“高冷喵星人”。" },
  ESFP: { title: "咋咋呼呼的搞笑刺客 / 全家最强显眼包", summary: "有它在，家里绝对不会有安静的时刻！它是一只为了吸引注意力而生的戏精猫，总能摆出各种让人啼笑皆非的扭曲姿势，或者突然对空气大打出手。它没心没肺、极度贪吃，只要听到零食袋的响声，无论在哪都会瞬间闪现。它就像一个永远不会断电的开心果，用它那笨拙又可爱的模样，承包了你所有的笑点。" },
  ESTP: { title: "胆大包天的惹祸精 / 制造麻烦小能手", summary: "这只猫咪的身体里装了一个无所畏惧的冒险家灵魂！不管多高的地方它都敢跳，不管什么新东西它都要凑上去闻一闻、咬一口。它是家里的“破坏大王”，推杯子、挠沙发样样精通，主打一个随心所欲。带它去宠物医院它甚至敢跟大狗叫板。虽然它总是让你头疼，但那种鲜活热烈的生命力，也让你深深着迷。" },
  ISFP: { title: "随遇而安的液体小懒猪 / 极度松弛感", summary: "这是真正的“液体猫猫”代表！脾气超级好，怎么撸都不会生气，被抱起来甚至会直接软成一摊泥。它对生活没有任何奢求，只要有一个能晒到太阳的垫子和一个满着的饭盆，它就能安安静静地睡上一整天。它身上自带一种极致的松弛感，每当你疲惫不堪时，只要揉一揉它软乎乎的肚子，所有的烦恼都会烟消云散。" },
  ISTP: { title: "独来独往的冷面游侠 / 别烦我谢谢", summary: "它是一只极具武侠气质的独行侠猫咪。它不喜欢被打扰，有着极其明确的边界感，任何强行的亲昵都会换来一套无情的喵喵拳。它身手敏捷，对家里飞过的虫子有着绝对的统治力。它看似对你不理不睬，但在你需要保护或者深夜熟睡时，它总会默默趴在离你不远的地方，用它独有的方式守护着你。" },
  ESFJ: { title: "热心肠的护门大将 / 唠叨碎碎念王者", summary: "它简直是个有着“老妈子”属性的猫咪。它极其在乎家里的规矩和每一个家庭成员的动向，只要你出门太久或者作息不规律，它就会跟在你屁股后面喵喵叫个不停，像是在严厉地训斥你。它非常需要你的回应，只要你跟它搭话，它就能跟你聊上大半天。这种带着点唠叨的深沉爱意，是它专属的温柔。" },
  ESTJ: { title: "严守饭点的强迫症所长 / 饿一秒都不行", summary: "这只猫咪对时间有着极其精准的把控能力，尤其是到了开罐头的时间！如果你敢晚点一分钟，它就会化身暴躁的催饭机器，绝不接受任何理由。它对猫砂盆的整洁度也有着严苛的要求。它聪明、果断，是这个家里说一不二的真正主子。只要你乖乖遵守它定下的规矩，它也会赏赐你一个满意的呼噜声。" },
  ISFJ: { title: "默默守候的贴心小棉袄 / 治愈系天神", summary: "它是一只脾气温和、极其长情的天使猫咪。它不会像别的猫那样上蹿下跳惹麻烦，更多的时候，它就像一个安静的影子，默默陪伴在你身边。它把你当成它世界的中心，只要看到你开心，它就会心满意足地眯起眼睛。它那毫无保留的信任和温柔的目光，拥有着能够治愈世间一切创伤的强大力量。" },
  ISTJ: { title: "极度规律的作息机器 / 喵星老干部", summary: "这是一只作息极度规律的“老干部”猫咪。它每天几点起床、几点巡视、几点睡觉，都有着雷打不动的生物钟。它不喜欢生活中有任何突如其来的变故，对新买的猫窝往往嗤之比鼻，只钟情于那个旧纸箱。它情绪稳定得可怕，绝不会一惊一乍。在这个充满变数的世界上，它是你最可靠、最安心的锚点。" }
};

const ResultPage = ({ result, petType, onReset }: ResultPageProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');

  const resultData = (petType === 'dog' ? dogResults[result] : catResults[result]) || dogResults['ENFP'];

  const downloadPoster = async () => {
    const posterNode = document.getElementById('share-poster');
    if (!posterNode) return;
    
    try {
      setIsGenerating(true);
      posterNode.style.display = 'flex';
      
      const canvas = await html2canvas(posterNode, {
        scale: 3,
        backgroundColor: '#FFFCF9',
        useCORS: true,
        logging: false,
        width: 1080,
      });

      const url = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `宠格解码-${result}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error('Poster generation failed', err);
      alert('海报生成失败，请重试');
    } finally {
      setIsGenerating(false);
      posterNode.style.display = 'none';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full min-h-screen items-center font-genjyuu relative overflow-hidden pb-20"
    >
      {/* ============================== */}
      {/* 隐形海报层 (1080px 导出专用) */}
      {/* ============================== */}
      <div 
        id="share-poster"
        className="fixed top-[-9999px] left-[-9999px] w-[1080px] h-auto bg-[#FFFCF9] z-[-1] overflow-hidden flex flex-col items-center pt-24 pb-20 px-24"
        style={{ display: 'none' }}
      >
        {/* 背景光晕 (适配全局调性) */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-15%] w-[800px] h-[800px] rounded-full" 
                style={{ background: 'radial-gradient(circle, rgba(255,217,61,0.25) 0%, rgba(255,217,61,0) 70%)' }} />
           <div className="absolute bottom-[-5%] right-[-15%] w-[700px] h-[700px] rounded-full" 
                style={{ background: 'radial-gradient(circle, rgba(255,135,178,0.15) 0%, rgba(255,135,178,0) 70%)' }} />
        </div>

        {/* 顶部品牌 */}
        <div className="flex flex-col items-center mb-16 relative z-10 w-full">
          <h1 className="text-3xl font-black tracking-[0.4em] text-chocolate/20 font-fredoka uppercase">
            PAW-SONALITY
          </h1>
          <div className="h-1 w-16 bg-primary/10 rounded-full mt-5" />
        </div>

        {/* 主体内容区 */}
        <div className="flex flex-col items-center w-full relative z-10">
          <h2 className="text-[2.8rem] text-chocolate/50 font-alimama tracking-widest z-20">你家毛茸茸的性格是：</h2>
          
          <div className="relative flex justify-center w-full -mt-6 mb-28">
            <div className="absolute inset-0 scale-150" 
                 style={{ background: 'radial-gradient(circle, rgba(239,90,61,0.05) 0%, rgba(239,90,61,0) 60%)' }} />
            <span className="text-[18rem] font-black text-primary tracking-[0.1em] drop-shadow-[0_30px_60px_rgba(239,90,61,0.2)] font-fredoka leading-none relative z-10">
              {result}
            </span>
            <Heart size={100} className={`absolute top-[-10%] right-[5%] ${petType === 'dog' ? 'text-accent-yellow' : 'text-accent-pink'} drop-shadow-2xl z-20`} fill="currentColor" />
          </div>

          <p className="text-[3.2rem] font-normal text-chocolate/90 font-muyao text-center leading-tight mb-16">
            {resultData.title}
          </p>

          {/* 海报描述卡片 - 移除所有引号装饰 */}
          <div className="w-full bg-white/60 backdrop-blur-md border border-white/80 p-20 rounded-[4.5rem] shadow-[0_40px_80px_rgba(74,44,42,0.04)] relative mb-12">
            <div className="text-chocolate/70 text-[2.4rem] leading-[2.8] font-genjyuu relative z-10 text-justify tracking-wide px-10">
              <p style={{ display: 'block' }}>{resultData.summary}</p>
              {isUnlocked && (
                <div className="mt-10 pt-10 border-t border-dashed border-primary/10">
                  <p>... 深度宠格分析内容 (已解锁) ...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部引流区 (极简无框排版版) - 标语向右平移 */}
        <div className="w-full flex items-center justify-between px-10 pt-8 mt-auto relative z-10">
          <div className="flex-1 flex flex-col justify-center pl-16">
             <h3 className="text-[4rem] text-chocolate/80 font-alimama tracking-widest leading-none">解码它的小宇宙</h3>
          </div>

          {/* 二维码区域 */}
          <div className="w-48 h-48 bg-white/60 backdrop-blur-md rounded-[2rem] shadow-sm border border-white flex flex-col items-center justify-center p-3 shrink-0">
             <div className="w-full h-full bg-white/50 rounded-[1.2rem] flex items-center justify-center border-2 border-dashed border-chocolate/10">
                <span className="text-chocolate/30 font-bold text-lg font-fredoka text-center px-2 leading-tight tracking-tighter">QR<br/>CODE</span>
             </div>
          </div>
        </div>

        {/* 底部小字 URL */}
        <div className="w-full text-center mt-12 relative z-10">
           <div className="text-[1.4rem] text-chocolate/20 font-fredoka tracking-[0.5em] uppercase leading-none whitespace-nowrap">
              WWW.PAW-SONALITY.COM
           </div>
        </div>
      </div>
      {/* ============================== */}


      {/* 真实的页面可见 UI */}
      <div className="w-full max-w-3xl px-6 py-12 flex flex-col items-center z-10 relative">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-normal text-chocolate mb-6 text-center font-alimama mt-6"
        >
          你家毛茸茸是...
        </motion.h2>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className="mb-8 relative flex justify-center w-full"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
          <span className="text-[6rem] md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#FF8E6E] tracking-[0.05em] drop-shadow-xl font-fredoka relative z-10 leading-none">
            {result}
          </span>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [-10, 10, -10] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-0 right-[10%] md:right-[20%] ${petType === 'dog' ? 'text-accent-yellow' : 'text-accent-pink'} z-20`}
          >
            <Heart size={42} fill="currentColor" className="drop-shadow-md" />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full flex justify-center mb-12 px-4"
        >
          <p className="text-xl md:text-3xl font-normal text-chocolate/80 font-muyao text-center leading-relaxed max-w-[95%] md:max-w-none" style={{ wordBreak: 'keep-all' }}>
            {resultData.title}
          </p>
        </motion.div>

        {/* 页面可见摘要卡片 - 同样移除引号 */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-[90%] md:max-w-[600px] mx-auto bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(74,44,42,0.03)] border border-white/80 mb-14 relative"
        >
          <p className="text-chocolate/70 text-base md:text-lg leading-loose font-genjyuu relative z-10 text-justify tracking-wide">
            {resultData.summary}
          </p>
        </motion.div>

        {!isUnlocked && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-[360px] md:max-w-[480px] mx-auto bg-white/80 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(239,90,61,0.08)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFD93D] via-primary to-[#FF87B2]" />

            <h3 className="text-xl md:text-2xl font-normal text-chocolate mb-6 text-center flex items-center justify-center gap-2 font-alimama">
              <div className="bg-primary/10 p-2 rounded-full">
                <Lock size={18} className="text-primary md:w-5 md:h-5" />
              </div>
              解锁隐藏的第 5 维度！
            </h3>
            
            <p className="text-chocolate/60 text-sm md:text-base mb-8 text-center leading-loose font-genjyuu px-2">
              想知道它是 <span className="font-bold text-primary/80">极度敏感型(-T)</span> 还是 <span className="font-bold text-primary/80">没心没肺型(-A)</span>？<br className="hidden md:block" />
              获取 <span className="font-bold text-chocolate underline decoration-primary/30 underline-offset-4">3000字专属深度报告</span> 与 <span className="font-bold text-chocolate underline decoration-primary/30 underline-offset-4">灵魂契合度雷达图</span>。
            </p>

            <div className="space-y-4 md:space-y-5 w-full max-w-xs mx-auto">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="输入魔法口令"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                  className="w-full bg-white/50 border-2 border-primary/10 rounded-[1.2rem] py-3.5 px-6 text-base font-medium text-center focus:border-primary focus:bg-white outline-none transition-all placeholder:text-chocolate/30 font-genjyuu shadow-inner"
                />
              </div>

              <motion.button 
                whileHover={{ y: -2, shadow: "0 10px 20px rgba(239,90,61,0.2)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (unlockCode === '8888') {
                    setIsUnlocked(true);
                  } else {
                    alert('口令不对哦，再确认一下？');
                  }
                }}
                className="w-full bg-primary text-white font-normal text-lg py-4 rounded-[1.2rem] shadow-[0_8px_20px_rgba(239,90,61,0.2)] transition-all font-alimama tracking-wider relative overflow-hidden group"
              >
                <span className="relative z-10">一键解锁全量报告</span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out hidden md:block" />
              </motion.button>

              <div className="text-center mt-3">
                <a href="#" className="text-chocolate/40 hover:text-primary font-bold text-xs tracking-widest uppercase transition-colors inline-block font-fredoka active:scale-95">
                  去哪找魔法口令？
                </a>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center justify-center gap-6 mt-12 w-full max-w-[360px] md:max-w-[480px]"
        >
          <button
            onClick={downloadPoster}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-alimama text-lg transition-colors active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="animate-pulse flex items-center gap-2"><Share2 size={20} /> 正在生成海报...</span>
            ) : (
              <>
                <Share2 size={20} />
                <span className="underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all">生成专属社交海报</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 text-chocolate/40 hover:text-chocolate/80 transition-all group font-genjyuu bg-white/50 backdrop-blur-sm px-8 py-3.5 rounded-full border border-transparent hover:border-chocolate/10 hover:shadow-sm active:scale-95"
          >
            <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-700 ease-in-out" />
            <span className="text-sm font-bold tracking-wider">换个崽重测</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ResultPage
