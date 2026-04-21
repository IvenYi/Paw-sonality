import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bone, Fish, Footprints } from 'lucide-react'

interface QuizPageProps {
  petType: 'dog' | 'cat'
  onComplete: (result: string, scores: Scores) => void
}

// MBTI 计分接口
export interface Scores {
  E: number; I: number;
  S: number; N: number;
  T: number; F: number;
  J: number; P: number;
  A: number; T_: number;
}

// 题库类型定义
interface Option {
  text: string;
  dimension: keyof Scores;
  weight: number;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

// 狗狗题库
const dogQuestions: Question[] = [
  {
    id: 1,
    text: "家里突然来了几个没见过的陌生朋友，它的第一反应是...",
    options: [
      { text: "【纯爱自来熟】狂摇尾巴扑上去求摸摸，不管是谁，来了就是客，兴奋到模糊。", dimension: 'E', weight: 2 },
      { text: "【尽职安保队长】冲到最前面“汪汪汪”一顿疯狂输出宣誓主权，直到你出面安抚才罢休。", dimension: 'E', weight: 1 },
      { text: "【暗中观察员】保持安全距离，一边警惕地闻空气中的味道，一边看你的眼色行事。", dimension: 'I', weight: 1 },
      { text: "【战术性撤退的怂包】秒怂，立刻以光速钻进床底或跑到你身后寻求庇护。", dimension: 'I', weight: 2 },
    ]
  },
  {
    id: 2,
    text: "带它去狗超多的宠物公园，一松开牵引绳它会...",
    options: [
      { text: "【满场乱飞的社牛】满场飞奔，挨个闻屁股打招呼，跟谁都能玩到一块儿，根本叫不回来。", dimension: 'E', weight: 2 },
      { text: "【霸道总裁型玩家】只找看着顺眼的狗玩，遇到不喜欢的直接凶回去或者强势压制。", dimension: 'E', weight: 1 },
      { text: "【专情于你的挂件】对别的狗兴趣不大，主要跟在你脚边转悠，别人来找它玩还有点嫌弃。", dimension: 'I', weight: 1 },
      { text: "【边缘 OB 的社恐晚期】找个没人的角落发呆啃草，或者紧张地贴着长椅，满脸写着“想回家”。", dimension: 'I', weight: 2 },
    ]
  },
  {
    id: 3,
    text: "在路上遇到另一只体型比它大得多的狗，它通常会...",
    options: [
      { text: "【毫无畏惧的平头哥】兴冲冲地跑过去试图交朋友，完全没有体型压制这回事。", dimension: 'E', weight: 2 },
      { text: "【虚张声势的键盘侠】躲在你腿边冲着对面狂吠，仿佛在说“要不是我主人拉着我，你就完了”。", dimension: 'E', weight: 1 },
      { text: "【默默绕道的体面狗】假装没看见，闻着地上的味道悄悄从旁边绕过去。", dimension: 'I', weight: 1 },
      { text: "【僵硬的石狮子】吓得一动不动，甚至趴在地上试图隐身，直到对方走远。", dimension: 'I', weight: 2 },
    ]
  },
  {
    id: 4,
    text: "玩“丢球游戏”的时候，如果球不小心滚进了沙发底...",
    options: [
      { text: "【简单粗暴的拆迁办】执念极深，死死盯着沙发底，用爪子疯狂扒拉半小时绝不放弃。", dimension: 'S', weight: 2 },
      { text: "【严谨的质检员】对着沙发底一顿狂吠，试图用魔法把球“喊”出来。", dimension: 'S', weight: 1 },
      { text: "【戏超多的脑补大师】扒拉两下找不到就算了，马上溜达去叼个别的玩具来找你。", dimension: 'N', weight: 1 },
      { text: "【灵魂出窍的哲学家】盯着空空如也的地板发呆，仿佛在思考球为什么会消失。", dimension: 'N', weight: 2 },
    ]
  },
  {
    id: 5,
    text: "带它走一条全新、完全没去过的散步路线，它的状态更像是...",
    options: [
      { text: "【专注地面的雷达探测器】一步一个脚印，极其严谨且沉迷地闻遍路上的每一根电线杆和每一泡狗尿。", dimension: 'S', weight: 2 },
      { text: "【容易跑偏的多动症】什么都想看一眼，但注意力很容易被突然跑过的外卖小哥或大卡车吸引。", dimension: 'S', weight: 1 },
      { text: "【兴奋的探险家】一直试图冲在最前面拽着你走，对未知的远方充满渴望。", dimension: 'N', weight: 1 },
      { text: "【容易分心的捕风少女/少年】走着走着突然停下来，盯着半空中的飞虫或是远处的树叶发呆。", dimension: 'N', weight: 2 },
    ]
  },
  {
    id: 6,
    text: "当你拿出平时装零食的那个特定袋子...",
    options: [
      { text: "【条件反射的干饭魂】听到塑料袋的声音马上就知道开饭了，激动地在原地狂转圈圈。", dimension: 'S', weight: 2 },
      { text: "【道德绑架的高手】跑过来坐得笔直，用极其清澈期待的眼神看着你，让你无法拒绝。", dimension: 'S', weight: 1 },
      { text: "【精准预判的神算子】还没拿出来，只要你走向那个特定的柜子，它就已经在摇尾巴了。", dimension: 'N', weight: 1 },
      { text: "【过度兴奋的误判者】在屋里到处乱窜，叼来牵引绳以为你要带它出门玩，完全搞错重点。", dimension: 'N', weight: 2 },
    ]
  },
  {
    id: 7,
    text: "当你周末舒舒服服地躺在沙发上刷手机时，它的状态通常是...",
    options: [
      { text: "【毫无边界感的长在身上】必须死死贴着你，最好能直接趴在你肚子上或大腿上，物理意义上的“长在你身上”。", dimension: 'F', weight: 2 },
      { text: "【强行营业的互动狂魔】叼着心爱的玩具疯狂拱你的手，疯狂暗示“别玩手机了，玩我！”。", dimension: 'F', weight: 1 },
      { text: "【默默守护的保安大叔】安静地趴在沙发旁边的地板上，只要你在它的视线范围内就行。", dimension: 'T', weight: 1 },
      { text: "【独立自强的单身狗】自己在另一个房间的狗窝里睡大觉，只要没到饭点，绝不轻易过来打扰你。", dimension: 'T', weight: 2 },
    ]
  },
  {
    id: 8,
    text: "遇到自己非常不喜欢的事情（比如洗澡、剪指甲）...",
    options: [
      { text: "【戏精附体的林黛玉】疯狂哼唧求饶，用无辜的大眼睛试图唤醒你的良知，仿佛遭受了天大的委屈。", dimension: 'F', weight: 2 },
      { text: "【消极怠工的软体动物】瞬间变成“一滩烂泥”，趴在地上死活不走，全靠你连拖带抱弄进浴室。", dimension: 'F', weight: 1 },
      { text: "【骂骂咧咧的抱怨者】一边试图挣脱一边嘴里骂骂咧咧，满脸写着“洗完必须给我加餐补偿”。", dimension: 'T', weight: 1 },
      { text: "【物理反抗的格斗家】直接上演一场斗智斗勇的追逐战，试图用武力逃避洗澡的命运。", dimension: 'T', weight: 2 },
    ]
  },
  {
    id: 9,
    text: "当你下班回家，晚了半个小时，它会...",
    options: [
      { text: "【世纪重逢的苦情剧主角】委屈巴巴地呜咽，兴奋到漏尿，像是一个世纪没见到你一样疯狂撒娇。", dimension: 'F', weight: 2 },
      { text: "【叼拖鞋的邀功精】叼着你的拖鞋满屋跑，兴奋得控制不住自己，必须让你看到它的热情。", dimension: 'F', weight: 1 },
      { text: "【例行公事的迎宾员】摇摇尾巴高兴地迎接一下，然后就去巡视自己的饭碗，示意该开饭了。", dimension: 'T', weight: 1 },
      { text: "【查岗的纪检委】走过来仔仔细细闻闻你身上的味道，仿佛在严厉检查你去哪鬼混了。", dimension: 'T', weight: 2 },
    ]
  },
  {
    id: 10,
    text: "到了每天固定的放饭时间，如果饭还没准备好...",
    options: [
      { text: "【无情的催饭机器】准时准点开始疯狂扒拉空饭碗，或者冲着你狂叫，绝不允许任何晚点。", dimension: 'J', weight: 2 },
      { text: "【幽怨的施压者】默默走到饭盆旁边坐下，用幽怨且坚定的眼神一直盯着你，给你施加心理压力。", dimension: 'J', weight: 1 },
      { text: "【佛系的随缘干饭狗】比较随缘，你不喂它就去干点别的，饿了才想起来过来蹭你两下。", dimension: 'P', weight: 1 },
      { text: "【凭感觉生活的干饭侠】作息极其混乱，半夜三更突然起来想干饭，或者把饭藏起来慢慢吃。", dimension: 'P', weight: 2 },
    ]
  },
  {
    id: 11,
    text: "在家里睡觉的时候，它对“床”的选择是...",
    options: [
      { text: "【领地意识极强的老古板】永远雷打不动地睡在自己固定的那几个专属“老地方”，绝不轻易换窝。", dimension: 'J', weight: 2 },
      { text: "【有原则的巡逻兵】白天喜欢睡在门口或过道监控动静，晚上必须上床跟你睡，有清晰的时间表。", dimension: 'J', weight: 1 },
      { text: "【哪里舒服躺哪里的摊大饼】比较随意，沙发、地毯、阳光下，跟着温度和心情变换睡觉地点。", dimension: 'P', weight: 1 },
      { text: "【没有边界感的液体狗】随地大小睡，经常以极其扭曲的姿势睡在你的拖鞋上、快递盒里，主打一个出其不意。", dimension: 'P', weight: 2 },
    ]
  },
  {
    id: 12,
    text: "正在专心吃零食时，你突然拿出一个新玩具叫它...",
    options: [
      { text: "【极度专注的单线程选手】不为所动，必须非常专注且严谨地把嘴里的零食彻底吃完才过去看。", dimension: 'J', weight: 2 },
      { text: "【权衡利弊的精明狗】犹豫了一下，叼着零食跑过来看玩具，试图两者兼得，绝不吃亏。", dimension: 'J', weight: 1 },
      { text: "【容易喜新厌旧的好奇宝宝】立刻丢下吃到一半的零食，兴奋地跑过去看新玩具是什么好玩的。", dimension: 'P', weight: 1 },
      { text: "【三分钟热度的健忘症】跑过来看了一眼玩具觉得没意思，转头把剩下的零食也给忘了，跑去玩别的了。", dimension: 'P', weight: 2 },
    ]
  }
];

// 猫咪题库
const catQuestions: Question[] = [
  {
    id: 1,
    text: "家里来了几个刚认识的陌生朋友，你家主子的第一反应是...",
    options: [
      { text: "【巡视领地的交际花】大大方方地走出来巡视领地，甚至主动去蹭客人的裤腿求摸摸。", dimension: 'E', weight: 2 },
      { text: "【碰瓷碰得明明白白的高手】躺在客厅最显眼的地方装睡，但如果客人来摸就会立刻跑开。", dimension: 'E', weight: 1 },
      { text: "【暗中观察的监控探头】躲在沙发底或门缝后静静观察，确认安全后偶尔出来溜达一圈刷个存在感。", dimension: 'I', weight: 1 },
      { text: "【光速融化的隐形刺客】瞬间消失在空气中，不到客人走绝不从柜顶/床底的异次元缝隙里下来。", dimension: 'I', weight: 2 },
    ]
  },
  {
    id: 2,
    text: "当你打开吸尘器开始打扫卫生时...",
    options: [
      { text: "【敢于亮剑的猛士】不但不躲，竟然还敢上前去拍打吸尘器，试图与这个噪音怪物一战。", dimension: 'E', weight: 2 },
      { text: "【高高在上的监督员】虽然觉得吵，但也要跳到最高处，死死盯着吸尘器的一举一动。", dimension: 'E', weight: 1 },
      { text: "【眼不见心不烦的躲避者】默默走到另一个安静的房间，满脸写着“愚蠢的人类又在发疯了”。", dimension: 'I', weight: 1 },
      { text: "【吓到模糊的小可怜】吓得魂飞魄散，炸毛后飞速窜进床底，很久都不敢出来。", dimension: 'I', weight: 2 },
    ]
  },
  {
    id: 3,
    text: "当你带它去宠物医院，刚从猫包里出来时...",
    options: [
      { text: "【巡视领地的无畏勇士】到处闻，甚至试图扒拉医生，试图把诊室也变成自己的地盘。", dimension: 'E', weight: 2 },
      { text: "【故作镇定的巡视员】虽然紧张，但还是会小心翼翼地探索一下台面，假装自己并不怕。", dimension: 'E', weight: 1 },
      { text: "【警惕的暗中观察者】贴着墙根走，找个角落躲起来，用警惕的眼神盯着所有人。", dimension: 'I', weight: 1 },
      { text: "【缩成一团的隐形刺客】死死扒着猫包不出来，或者拼命往你怀里钻，瑟瑟发抖。", dimension: 'I', weight: 2 },
    ]
  },
  {
    id: 4,
    text: "玩逗猫棒的时候，它的动作模式更像是...",
    options: [
      { text: "【极其专注的职业杀手】死死盯着羽毛的轨迹，不出爪则已，一击必中，极其精准。", dimension: 'S', weight: 2 },
      { text: "【敷衍了事的划水员工】躺在地上随便挥两下爪子敷衍你一下，懒得动弹，主打一个陪伴。", dimension: 'S', weight: 1 },
      { text: "【沉迷假想敌的中二病】突然对逗猫棒的杆子产生浓厚兴趣，开始疯狂咬棍子，完全忽略羽毛。", dimension: 'N', weight: 1 },
      { text: "【脑洞大开的空气捕手】经常自己脑补空气里有东西在飞，对着虚无的空气疯狂扑腾。", dimension: 'N', weight: 2 },
    ]
  },
  {
    id: 5,
    text: "给它买了一个昂贵的豪华猫爬架，它的反应是...",
    options: [
      { text: "【严谨的验收员】仔仔细细把每个角落闻一遍，确认材质安全后开始心满意足地磨爪子。", dimension: 'S', weight: 2 },
      { text: "【傲视群雄的王座体验官】直接睡在最高层，仿佛自己是统治这个家的王者，俯视众生。", dimension: 'S', weight: 1 },
      { text: "【沉迷包装盒的怪咖】对几百块的爬架视而不见，反而钻进装爬架的那个破烂快递纸箱里死活不出来。", dimension: 'N', weight: 1 },
      { text: "【极限运动跑酷达人】根本不在上面睡觉，只把它当成半夜跑酷和极限跳跃的踏板。", dimension: 'N', weight: 2 },
    ]
  },
  {
    id: 6,
    text: "如果你悄悄改变了家里一件大电器或纸箱的位置...",
    options: [
      { text: "【敏锐的安检雷达】马上发现不对劲，走过去极其谨慎地闻半天，确认没有威胁。", dimension: 'S', weight: 2 },
      { text: "【领地扩张的占领者】走过去蹭一蹭，留下自己的气味，宣布这个新角落现在归它所有。", dimension: 'S', weight: 1 },
      { text: "【多疑的绕路小分队】表现得很警惕，连续几天都绕着那个地方走，觉得总有刁民想害朕。", dimension: 'N', weight: 1 },
      { text: "【迟钝的瞎子猫】毫不介意，仿佛什么都没发生，或者过了好几天撞到了才突然意识到有个东西变了。", dimension: 'N', weight: 2 },
    ]
  },
  {
    id: 7,
    text: "当你周末舒舒服服地躺在床上刷手机时，它的状态通常是...",
    options: [
      { text: "【毫无边界感的踩奶工】必须趴在你胸口或脖子上疯狂踩奶，呼噜震天响，完全不管你能不能喘气。", dimension: 'F', weight: 2 },
      { text: "【强行营业的互动狂魔】不停拿头蹭你的手机或手，甚至直接躺在手机屏幕上，强迫你摸它。", dimension: 'F', weight: 1 },
      { text: "【保持距离的傲娇怪】睡在床尾或者你脚边，必须保持一段安全距离，偶尔看你一眼。", dimension: 'T', weight: 1 },
      { text: "【独自美丽的单身猫】在另一个房间的猫窝或窗台上睡大觉，只要没到饭点，绝不来找你。", dimension: 'T', weight: 2 },
    ]
  },
  {
    id: 8,
    text: "当你出差或旅游了两三天，推开家门回来的那一刻，它通常会...",
    options: [
      { text: "【世纪重逢的嘤嘤怪】立刻跑到门口，发出极其委屈的拖长音喵喵叫，疯狂蹭你，接下来的几个小时像个长在身上的挂件。", dimension: 'F', weight: 2 },
      { text: "【口嫌体正直的傲娇怪】刚开始假装不在意，但会默默跟在你身后看着你收拾行李，等你坐下后立刻凑过来要摸摸。", dimension: 'F', weight: 1 },
      { text: "【记仇的冷暴力大师】因为你把它独自留在家而生气，故意不理你，甚至对你骂骂咧咧，需要你开罐头哄半天才肯原谅你。", dimension: 'T', weight: 1 },
      { text: "【毫无波澜的合租室友】瞥你一眼发现不是外卖，继续睡大觉。只要猫粮盆没空，它甚至都没意识到你离开过。", dimension: 'T', weight: 2 },
    ]
  },
  {
    id: 9,
    text: "想要你陪它玩或者想要吃零食的时候，它的策略是...",
    options: [
      { text: "【绿茶级别的撒娇精】开启极其甜美的夹子音疯狂撒娇，用头疯狂蹭你的腿，软磨硬泡。", dimension: 'F', weight: 2 },
      { text: "【满地打滚的碰瓷大师】在你面前各种翻肚皮、打滚，疯狂暗示，你不理它它就不起来。", dimension: 'F', weight: 1 },
      { text: "【制造麻烦的心机猫】故意去挠沙发或把桌上的东西推下去，用制造麻烦来强行引起你的注意。", dimension: 'T', weight: 1 },
      { text: "【霸道的主管】直接上手无情地扒拉你，或者坐在那冷冷地盯着你，直到你“懂事”地去拿罐头。", dimension: 'T', weight: 2 },
    ]
  },
  {
    id: 10,
    text: "当你在卧室或卫生间关上门，把它关在外面时，它的反应是...",
    options: [
      { text: "【坚定的破门者】立刻开始疯狂挠门、大声喵叫，甚至试图扭动门把手，绝不允许领地内有禁区。", dimension: 'J', weight: 2 },
      { text: "【执着的守门员】不会剧烈反抗，但会一直静静地蹲在门外的地毯上，等你开门时给你一个幽怨的眼神。", dimension: 'J', weight: 1 },
      { text: "【随遇而安的佛系猫】象征性地扒拉两下门缝，看你没反应，就打个哈欠溜达去别的地方睡觉了。", dimension: 'P', weight: 1 },
      { text: "【自娱自乐的游侠】完全不在意门关着，已经跑去客厅祸害你的沙发，或者对着空气开始跑酷了。", dimension: 'P', weight: 2 },
    ]
  },
  {
    id: 11,
    text: "观察它上完厕所（猫砂盆）后的“埋屎”风格，更像是...",
    options: [
      { text: "【强迫症爆表的施工队】极其严谨，必须疯狂扒拉猫砂，直到把现场掩埋得严严实实才肯出来。", dimension: 'J', weight: 2 },
      { text: "【形式主义的空气埋砂师】极其努力地在埋，但其实一直在疯狂刨猫砂盆的边缘或墙壁，刨了个寂寞。", dimension: 'J', weight: 1 },
      { text: "【敷衍了事的快闪族】随便象征性地扒拉两下猫砂，也不管到底盖没盖住，直接光速逃离作案现场。", dimension: 'P', weight: 1 },
      { text: "【毫无底线的炸弹客】根本不埋！拉完直接走猫，留着新鲜的味道对你进行生化武器攻击。", dimension: 'P', weight: 2 },
    ]
  },
  {
    id: 12,
    text: "当你想把它抱起来猛吸一口的时候...",
    options: [
      { text: "【严格遵守营业时间的总裁】必须在它心情好的“特定时间段”才可以抱，否则严词拒绝并给你一套喵喵拳。", dimension: 'J', weight: 2 },
      { text: "【限时供应的傲娇怪】可以抱，但只能抱一小会儿，时间稍微长一点它就开始不耐烦立刻翻脸挣脱。", dimension: 'J', weight: 1 },
      { text: "【生无可恋的受气包】象征性挣扎两下，看逃不掉就四肢僵硬、生无可恋地忍受你的蹂躏。", dimension: 'P', weight: 1 },
      { text: "【没有底线的液体猫】像个液体一样随便你揉捏、吸肚子，脾气超级好，甚至会在你怀里直接睡着。", dimension: 'P', weight: 2 },
    ]
  }
];

const QuizPage = ({ petType, onComplete }: QuizPageProps) => {
  const [step, setStep] = useState(0); 
  const [scores, setScores] = useState<Scores>({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  
  const questions = petType === 'dog' ? dogQuestions : catQuestions;
  const totalSteps = questions.length;
  const currentQuestion = questions[step];

  const skipToResult = () => {
    const randomScores: Scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questions.forEach(q => {
      const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
      randomScores[randomOption.dimension] += randomOption.weight;
    });
    
    const E_or_I = randomScores.E > randomScores.I ? 'E' : 'I';
    const S_or_N = randomScores.S > randomScores.N ? 'S' : 'N';
    const T_or_F = randomScores.T > randomScores.F ? 'T' : 'F';
    const J_or_P = randomScores.J > randomScores.P ? 'J' : 'P';
    const finalMBTI = `${E_or_I}${S_or_N}${T_or_F}${J_or_P}`;
    
    onComplete(finalMBTI, randomScores);
  };

  const handleOptionClick = (dimension: keyof Scores, weight: number) => {
    const newScores = { ...scores, [dimension]: scores[dimension] + weight };
    setScores(newScores);

    setTimeout(() => {
      if (step + 1 < totalSteps) {
        setStep(step + 1);
      } else {
        const E_or_I = newScores.E > newScores.I ? 'E' : 'I';
        const S_or_N = newScores.S > newScores.N ? 'S' : 'N';
        const T_or_F = newScores.T > newScores.F ? 'T' : 'F';
        const J_or_P = newScores.J > newScores.P ? 'J' : 'P';
        const finalMBTI = `${E_or_I}${S_or_N}${T_or_F}${J_or_P}`;
        
        onComplete(finalMBTI, newScores);
      }
    }, 400); 
  };

  const themeColor = petType === 'dog' ? 'bg-accent-yellow/30' : 'bg-accent-pink/30'
  const progressBg = petType === 'dog' ? 'bg-accent-yellow/40' : 'bg-accent-pink/40'
  const activeHoverColor = petType === 'dog' ? 'hover:bg-accent-yellow/10 hover:border-accent-yellow' : 'hover:bg-accent-pink/10 hover:border-accent-pink'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full min-h-screen items-center font-genjyuu relative overflow-hidden"
    >
      <div className="w-full max-w-2xl px-6 flex flex-col flex-1 pb-12 z-10 relative">
        <header className="flex items-center justify-between mb-10 pt-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-primary/5"
          >
            <Footprints className="text-primary" size={20} />
            <h2 className="text-primary font-normal text-lg md:text-xl font-alimama tracking-wider">
              第 {step + 1} 题 <span className="text-primary/40 font-fredoka mx-1">/</span> 共 {totalSteps} 题
            </h2>
          </motion.div>
          <div className="flex items-center gap-2">
            <button 
              onClick={skipToResult}
              className="px-4 py-2 bg-white/60 backdrop-blur-md text-primary/60 hover:text-primary rounded-full text-sm font-alimama border border-primary/5 hover:border-primary/20 transition-all shadow-sm"
            >
              跳过调试
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="text-chocolate/30 hover:text-primary hover:bg-white/80 backdrop-blur-sm p-3 rounded-full transition-all shadow-sm border border-transparent hover:border-primary/10"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        <div className={`w-full h-4 ${progressBg} rounded-full mb-12 overflow-hidden shadow-inner relative`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-[#FF8E6E] rounded-full"
          >
            <div className="absolute right-1 top-[2px] w-2 h-2 bg-white/50 rounded-full blur-[1px]" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(74,44,42,0.05)] mb-8 flex-1 flex flex-col relative overflow-hidden">
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${themeColor} blur-3xl rounded-full pointer-events-none`} />
              <div className="mb-6 md:mb-10 relative z-10 flex gap-4 items-start">
                {petType === 'dog' ? (
                  <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="shrink-0 mt-1 md:mt-0">
                    <Bone className="text-[#FFD93D] drop-shadow-sm" size={32} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="shrink-0 mt-1 md:mt-0">
                    <Fish className="text-[#FF87B2] drop-shadow-sm" size={32} strokeWidth={2.5} />
                  </motion.div>
                )}
                <h3 className="text-2xl md:text-4xl font-normal text-chocolate leading-snug md:leading-relaxed font-alimama tracking-wide">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="w-full flex flex-col gap-4 md:gap-5 mt-4 md:mt-6 relative z-10 max-w-[340px] md:max-w-[480px] mx-auto">
                {currentQuestion.options.map((option, index) => {
                  const match = option.text.match(/^【(.*?)】(.*)$/);
                  const label = match ? match[1] : '';
                  const desc = match ? match[2] : option.text;

                  return (
                    <motion.button
                      key={index}
                      onClick={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = `var(--${petType === 'dog' ? 'accent-yellow' : 'accent-pink'})`;
                        handleOptionClick(option.dimension, option.weight);
                      }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full bg-white p-5 md:p-7 text-left border-2 border-primary/5 ${activeHoverColor} rounded-[2rem] shadow-[0_8px_24px_rgba(74,44,42,0.06)] hover:shadow-[0_12px_30px_rgba(74,44,42,0.1)] transition-all duration-300 group flex flex-col gap-1.5`}
                    >
                      {label && (
                        <span className="text-primary font-bold text-sm md:text-base font-fredoka tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                          {label}
                        </span>
                      )}
                      <span className="text-base md:text-lg font-medium text-chocolate/80 group-hover:text-chocolate transition-colors font-genjyuu leading-relaxed">
                        {desc}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="text-center opacity-60 hover:opacity-100 transition-opacity pb-6">
          <p className="text-chocolate/40 text-xs md:text-sm italic leading-relaxed font-genjyuu">
            基于 500+ 宠物行为学专家的临床观察得出... <br className="hidden md:block" />
            开玩笑的，但真的很准！
          </p>
        </footer>
      </div>
    </motion.div>
  )
}

export default QuizPage
