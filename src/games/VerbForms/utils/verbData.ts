import { Verb, VerbTense, VerbFormsConfig } from '../types';
import { DifficultyLevel } from '@/types/game';
import { shuffle } from '@/lib/utils';

const irregularVerbs: Verb[] = [
    {
        base: "be",
        past: "was/were",
        pastParticiple: "been",
        present: "am/is/are",
        gerund: "being",
        isRegular: false,
        examples: {
            present: "She is a doctor.",
            past: "They were at home yesterday.",
            future: "I will be there tomorrow.",
            presentPerfect: "He has been sick for days.",
            pastPerfect: "We had been friends for years."
        }
    },
    {
        base: "have",
        past: "had",
        pastParticiple: "had",
        present: "has/have",
        gerund: "having",
        isRegular: false,
        examples: {
            present: "She has a new car.",
            past: "They had a great time.",
            future: "We will have dinner soon.",
            presentPerfect: "He has had many opportunities.",
            pastPerfect: "I had had enough by then."
        }
    },
    {
        base: "do",
        past: "did",
        pastParticiple: "done",
        present: "does",
        gerund: "doing",
        isRegular: false,
        examples: {
            present: "He does his homework daily.",
            past: "They did their best.",
            future: "We will do it together.",
            presentPerfect: "She has done all the work.",
            pastPerfect: "I had done it before they asked."
        }
    },
    {
        base: "say",
        past: "said",
        pastParticiple: "said",
        present: "says",
        gerund: "saying",
        isRegular: false,
        examples: {
            present: "He says hello.",
            past: "They said goodbye.",
            future: "We will say nothing.",
            presentPerfect: "She has said that before.",
            pastPerfect: "I had said my piece."
        }
    },
    {
        base: "go",
        past: "went",
        pastParticiple: "gone",
        present: "goes",
        gerund: "going",
        isRegular: false,
        examples: {
            present: "She goes to school every day.",
            past: "They went to Paris last summer.",
            future: "We will go to the beach.",
            presentPerfect: "He has gone home already.",
            pastPerfect: "They had gone before we arrived."
        }
    },
    {
        base: "get",
        past: "got",
        pastParticiple: "gotten/got",
        present: "gets",
        gerund: "getting",
        isRegular: false,
        examples: {
            present: "He gets good grades.",
            past: "They got the message.",
            future: "We will get there on time.",
            presentPerfect: "She has gotten better at it.",
            pastPerfect: "I had got the tickets in advance."
        }
    },
    {
        base: "make",
        past: "made",
        pastParticiple: "made",
        present: "makes",
        gerund: "making",
        isRegular: false,
        examples: {
            present: "She makes beautiful cakes.",
            past: "They made a mistake.",
            future: "We will make dinner tonight.",
            presentPerfect: "He has made his decision.",
            pastPerfect: "We had made arrangements."
        }
    },
    {
        base: "know",
        past: "knew",
        pastParticiple: "known",
        present: "knows",
        gerund: "knowing",
        isRegular: false,
        examples: {
            present: "He knows the answer.",
            past: "They knew about it.",
            future: "We will know soon enough.",
            presentPerfect: "She has known him for years.",
            pastPerfect: "I had known that would happen."
        }
    },
    {
        base: "think",
        past: "thought",
        pastParticiple: "thought",
        present: "thinks",
        gerund: "thinking",
        isRegular: false,
        examples: {
            present: "She thinks deeply about everything.",
            past: "They thought it was a good idea.",
            future: "We will think about it.",
            presentPerfect: "He has thought it through.",
            pastPerfect: "I had thought differently before."
        }
    },
    {
        base: "take",
        past: "took",
        pastParticiple: "taken",
        present: "takes",
        gerund: "taking",
        isRegular: false,
        examples: {
            present: "He takes the bus to work.",
            past: "They took their time.",
            future: "We will take care of it.",
            presentPerfect: "She has taken the test.",
            pastPerfect: "They had taken all precautions."
        }
    }
]
const regularVerbs: Verb[] = [
    {
        base: "ask",
        past: "asked",
        pastParticiple: "asked",
        present: "asks",
        gerund: "asking",
        isRegular: true,
        examples: {
            present: "She asks good questions in class.",
            past: "I asked him for directions yesterday.",
            future: "They will ask for more time.",
            presentPerfect: "He has asked for help several times.",
            pastPerfect: "We had asked permission before entering."
        }
    },
    {
        base: "work",
        past: "worked",
        pastParticiple: "worked",
        present: "works",
        gerund: "working",
        isRegular: true,
        examples: {
            present: "He works in a large company.",
            past: "She worked overtime last week.",
            future: "They will work on this project.",
            presentPerfect: "I have worked here for five years.",
            pastPerfect: "We had worked all day before leaving."
        }
    },
    {
        base: "talk",
        past: "talked",
        pastParticiple: "talked",
        present: "talks",
        gerund: "talking",
        isRegular: true,
        examples: {
            present: "She talks to her friends every day.",
            past: "We talked about the problem yesterday.",
            future: "They will talk about it tomorrow.",
            presentPerfect: "He has talked to the manager already.",
            pastPerfect: "I had talked to him before the meeting."
        }
    },
    {
        base: "walk",
        past: "walked",
        pastParticiple: "walked",
        present: "walks",
        gerund: "walking",
        isRegular: true,
        examples: {
            present: "He walks to school every morning.",
            past: "They walked in the park last weekend.",
            future: "We will walk along the beach.",
            presentPerfect: "She has walked five miles today.",
            pastPerfect: "I had walked this path many times before."
        }
    },
    {
        base: "play",
        past: "played",
        pastParticiple: "played",
        present: "plays",
        gerund: "playing",
        isRegular: true,
        examples: {
            present: "He plays soccer every weekend.",
            past: "They played games all afternoon.",
            future: "We will play tennis tomorrow.",
            presentPerfect: "She has played piano since childhood.",
            pastPerfect: "I had played that song before."
        }
    },
    {
        base: "help",
        past: "helped",
        pastParticiple: "helped",
        present: "helps",
        gerund: "helping",
        isRegular: true,
        examples: {
            present: "She helps her mother cook dinner.",
            past: "They helped me move last week.",
            future: "He will help us with the project.",
            presentPerfect: "We have helped many people.",
            pastPerfect: "They had helped before we asked."
        }
    },
    {
        base: "start",
        past: "started",
        pastParticiple: "started",
        present: "starts",
        gerund: "starting",
        isRegular: true,
        examples: {
            present: "The movie starts at 8 PM.",
            past: "We started the meeting on time.",
            future: "They will start working tomorrow.",
            presentPerfect: "He has started a new project.",
            pastPerfect: "The class had started before I arrived."
        }
    },
    {
        base: "stop",
        past: "stopped",
        pastParticiple: "stopped",
        present: "stops",
        gerund: "stopping",
        isRegular: true,
        examples: {
            present: "The bus stops here every hour.",
            past: "It stopped raining an hour ago.",
            future: "We will stop for lunch soon.",
            presentPerfect: "She has stopped smoking.",
            pastPerfect: "They had stopped working before sunset."
        }
    },
    {
        base: "watch",
        past: "watched",
        pastParticiple: "watched",
        present: "watches",
        gerund: "watching",
        isRegular: true,
        examples: {
            present: "He watches TV every evening.",
            past: "We watched the sunset yesterday.",
            future: "They will watch the game together.",
            presentPerfect: "I have watched this movie twice.",
            pastPerfect: "She had watched all episodes before."
        }
    },
    {
        base: "call",
        past: "called",
        pastParticiple: "called",
        present: "calls",
        gerund: "calling",
        isRegular: true,
        examples: {
            present: "She calls her mother every day.",
            past: "I called you last night.",
            future: "He will call back later.",
            presentPerfect: "They have called three times today.",
            pastPerfect: "We had called before visiting."
        }
    },
    {
        base: "need",
        past: "needed",
        pastParticiple: "needed",
        present: "needs",
        gerund: "needing",
        isRegular: true,
        examples: {
            present: "He needs more time to finish.",
            past: "They needed help with the move.",
            future: "We will need extra supplies.",
            presentPerfect: "She has needed assistance before.",
            pastPerfect: "I had needed glasses for years."
        }
    },
    {
        base: "want",
        past: "wanted",
        pastParticiple: "wanted",
        present: "wants",
        gerund: "wanting",
        isRegular: true,
        examples: {
            present: "She wants to learn Spanish.",
            past: "They wanted to join us.",
            future: "He will want to see this.",
            presentPerfect: "I have wanted to travel there.",
            pastPerfect: "We had wanted to help."
        }
    },
    {
        base: "like",
        past: "liked",
        pastParticiple: "liked",
        present: "likes",
        gerund: "liking",
        isRegular: true,
        examples: {
            present: "He likes ice cream.",
            past: "They liked the movie.",
            future: "You will like this book.",
            presentPerfect: "She has liked him for years.",
            pastPerfect: "I had liked the idea from the start."
        }
    },
    {
        base: "love",
        past: "loved",
        pastParticiple: "loved",
        present: "loves",
        gerund: "loving",
        isRegular: true,
        examples: {
            present: "She loves chocolate.",
            past: "They loved the concert.",
            future: "You will love this place.",
            presentPerfect: "He has loved music all his life.",
            pastPerfect: "We had loved living there."
        }
    },
    {
        base: "live",
        past: "lived",
        pastParticiple: "lived",
        present: "lives",
        gerund: "living",
        isRegular: true,
        examples: {
            present: "He lives in New York.",
            past: "They lived in Paris for years.",
            future: "We will live abroad.",
            presentPerfect: "She has lived here since 2010.",
            pastPerfect: "I had lived there before moving."
        }
    },
    {
        base: "learn",
        past: "learned",
        pastParticiple: "learned",
        present: "learns",
        gerund: "learning",
        isRegular: true,
        examples: {
            present: "She learns quickly.",
            past: "He learned to drive last year.",
            future: "They will learn Spanish next semester.",
            presentPerfect: "I have learned a lot from this experience.",
            pastPerfect: "We had learned about it before the meeting."
        }
    },
    {
        base: "study",
        past: "studied",
        pastParticiple: "studied",
        present: "studies",
        gerund: "studying",
        isRegular: true,
        examples: {
            present: "He studies medicine at university.",
            past: "They studied all night for the exam.",
            future: "We will study together tomorrow.",
            presentPerfect: "She has studied English for five years.",
            pastPerfect: "I had studied the material before class."
        }
    },
    {
        base: "use",
        past: "used",
        pastParticiple: "used",
        present: "uses",
        gerund: "using",
        isRegular: true,
        examples: {
            present: "She uses her computer every day.",
            past: "They used the new software yesterday.",
            future: "He will use the car tomorrow.",
            presentPerfect: "We have used this method before.",
            pastPerfect: "They had used all the resources."
        }
    },
    {
        base: "try",
        past: "tried",
        pastParticiple: "tried",
        present: "tries",
        gerund: "trying",
        isRegular: true,
        examples: {
            present: "He tries his best every time.",
            past: "I tried to call you yesterday.",
            future: "They will try the new restaurant.",
            presentPerfect: "She has tried everything possible.",
            pastPerfect: "We had tried to warn them."
        }
    },
    {
        base: "listen",
        past: "listened",
        pastParticiple: "listened",
        present: "listens",
        gerund: "listening",
        isRegular: true,
        examples: {
            present: "She listens to music while working.",
            past: "They listened to the lecture carefully.",
            future: "We will listen to your suggestions.",
            presentPerfect: "He has listened to that song many times.",
            pastPerfect: "I had listened to the podcast before."
        }
    },
    {
        base: "look",
        past: "looked",
        pastParticiple: "looked",
        present: "looks",
        gerund: "looking",
        isRegular: true,
        examples: {
            present: "He looks tired today.",
            past: "They looked everywhere for the keys.",
            future: "We will look into the matter.",
            presentPerfect: "She has looked at all options.",
            pastPerfect: "I had looked forward to this event."
        }
    },
    {
        base: "wait",
        past: "waited",
        pastParticiple: "waited",
        present: "waits",
        gerund: "waiting",
        isRegular: true,
        examples: {
            present: "She waits for the bus every morning.",
            past: "We waited for an hour.",
            future: "They will wait here.",
            presentPerfect: "He has waited long enough.",
            pastPerfect: "I had waited there before."
        }
    },
    {
        base: "open",
        past: "opened",
        pastParticiple: "opened",
        present: "opens",
        gerund: "opening",
        isRegular: true,
        examples: {
            present: "The store opens at 9 AM.",
            past: "They opened the presents early.",
            future: "We will open the meeting with a speech.",
            presentPerfect: "She has opened all the windows.",
            pastPerfect: "He had opened the door before I arrived."
        }
    },
    {
        base: "close",
        past: "closed",
        pastParticiple: "closed",
        present: "closes",
        gerund: "closing",
        isRegular: true,
        examples: {
            present: "The bank closes at 5 PM.",
            past: "They closed the deal yesterday.",
            future: "We will close the meeting on time.",
            presentPerfect: "She has closed all accounts.",
            pastPerfect: "They had closed the office before leaving."
        }
    },
    {
        base: "clean",
        past: "cleaned",
        pastParticiple: "cleaned",
        present: "cleans",
        gerund: "cleaning",
        isRegular: true,
        examples: {
            present: "She cleans her room every week.",
            past: "They cleaned the whole house.",
            future: "We will clean the office tomorrow.",
            presentPerfect: "He has cleaned his car already.",
            pastPerfect: "I had cleaned everything before guests arrived."
        }
    },
    {
        base: "cook",
        past: "cooked",
        pastParticiple: "cooked",
        present: "cooks",
        gerund: "cooking",
        isRegular: true,
        examples: {
            present: "He cooks dinner every night.",
            past: "They cooked a fantastic meal.",
            future: "We will cook together this weekend.",
            presentPerfect: "She has cooked for hundreds of people.",
            pastPerfect: "I had cooked before they arrived."
        }
    },
    {
        base: "dance",
        past: "danced",
        pastParticiple: "danced",
        present: "dances",
        gerund: "dancing",
        isRegular: true,
        examples: {
            present: "She dances beautifully.",
            past: "They danced all night.",
            future: "We will dance at the wedding.",
            presentPerfect: "He has danced professionally for years.",
            pastPerfect: "They had danced together before."
        }
    }, {
        base: "jump",
        past: "jumped",
        pastParticiple: "jumped",
        present: "jumps",
        gerund: "jumping",
        isRegular: true,
        examples: {
            present: "He jumps over the fence easily.",
            past: "They jumped into the pool.",
            future: "We will jump at the opportunity.",
            presentPerfect: "She has jumped with a parachute before.",
            pastPerfect: "I had jumped to conclusions too quickly."
        }
    },
    {
        base: "laugh",
        past: "laughed",
        pastParticiple: "laughed",
        present: "laughs",
        gerund: "laughing",
        isRegular: true,
        examples: {
            present: "She laughs at all his jokes.",
            past: "They laughed throughout the movie.",
            future: "We will laugh about this later.",
            presentPerfect: "He has laughed so much today.",
            pastPerfect: "We had laughed until we cried."
        }
    },
    {
        base: "move",
        past: "moved",
        pastParticiple: "moved",
        present: "moves",
        gerund: "moving",
        isRegular: true,
        examples: {
            present: "He moves quickly and efficiently.",
            past: "They moved to a new city last year.",
            future: "We will move the furniture tomorrow.",
            presentPerfect: "She has moved three times this year.",
            pastPerfect: "They had moved before winter came."
        }
    },
    {
        base: "paint",
        past: "painted",
        pastParticiple: "painted",
        present: "paints",
        gerund: "painting",
        isRegular: true,
        examples: {
            present: "She paints beautiful landscapes.",
            past: "They painted the house last summer.",
            future: "We will paint the room blue.",
            presentPerfect: "He has painted professionally for years.",
            pastPerfect: "I had painted the fence before it rained."
        }
    },
    {
        base: "plan",
        past: "planned",
        pastParticiple: "planned",
        present: "plans",
        gerund: "planning",
        isRegular: true,
        examples: {
            present: "He plans everything carefully.",
            past: "They planned the event perfectly.",
            future: "We will plan our vacation soon.",
            presentPerfect: "She has planned many successful parties.",
            pastPerfect: "We had planned for every contingency."
        }
    },
    {
        base: "rain",
        past: "rained",
        pastParticiple: "rained",
        present: "rains",
        gerund: "raining",
        isRegular: true,
        examples: {
            present: "It rains a lot in spring.",
            past: "It rained all weekend.",
            future: "They say it will rain tomorrow.",
            presentPerfect: "It has rained for three days straight.",
            pastPerfect: "It had rained before we left."
        }
    },
    {
        base: "show",
        past: "showed",
        pastParticiple: "showed",
        present: "shows",
        gerund: "showing",
        isRegular: true,
        examples: {
            present: "She shows great potential.",
            past: "They showed us around the city.",
            future: "We will show you how it works.",
            presentPerfect: "He has shown improvement lately.",
            pastPerfect: "I had shown them the way before."
        }
    },
    {
        base: "smile",
        past: "smiled",
        pastParticiple: "smiled",
        present: "smiles",
        gerund: "smiling",
        isRegular: true,
        examples: {
            present: "He smiles whenever he sees her.",
            past: "They smiled at the good news.",
            future: "We will smile for the photo.",
            presentPerfect: "She has smiled all day.",
            pastPerfect: "Everyone had smiled at the joke."
        }
    },
    {
        base: "stay",
        past: "stayed",
        pastParticiple: "stayed",
        present: "stays",
        gerund: "staying",
        isRegular: true,
        examples: {
            present: "She stays calm under pressure.",
            past: "They stayed at a nice hotel.",
            future: "We will stay until the end.",
            presentPerfect: "He has stayed with us before.",
            pastPerfect: "I had stayed there many times."
        }
    },
    {
        base: "thank",
        past: "thanked",
        pastParticiple: "thanked",
        present: "thanks",
        gerund: "thanking",
        isRegular: true,
        examples: {
            present: "He thanks everyone for their help.",
            past: "They thanked us for coming.",
            future: "We will thank them properly.",
            presentPerfect: "She has thanked all the guests.",
            pastPerfect: "We had thanked them earlier."
        }
    },
    {
        base: "visit",
        past: "visited",
        pastParticiple: "visited",
        present: "visits",
        gerund: "visiting",
        isRegular: true,
        examples: {
            present: "She visits her grandmother weekly.",
            past: "They visited Paris last summer.",
            future: "We will visit the museum tomorrow.",
            presentPerfect: "He has visited many countries.",
            pastPerfect: "I had visited that place before."
        }
    },
    {
        base: "wash",
        past: "washed",
        pastParticiple: "washed",
        present: "washes",
        gerund: "washing",
        isRegular: true,
        examples: {
            present: "He washes his car every weekend.",
            past: "They washed all the dishes.",
            future: "We will wash the windows tomorrow.",
            presentPerfect: "She has washed her hands already.",
            pastPerfect: "I had washed everything before leaving."
        }
    },
    {
        base: "wish",
        past: "wished",
        pastParticiple: "wished",
        present: "wishes",
        gerund: "wishing",
        isRegular: true,
        examples: {
            present: "She wishes upon a star.",
            past: "They wished for good weather.",
            future: "We will wish you luck.",
            presentPerfect: "He has wished for this many times.",
            pastPerfect: "I had wished things were different."
        }
    },
    {
        base: "see",
        past: "saw",
        pastParticiple: "seen",
        present: "sees",
        gerund: "seeing",
        isRegular: false,
        examples: {
            present: "He sees the problem clearly.",
            past: "They saw a movie yesterday.",
            future: "We will see what happens.",
            presentPerfect: "She has seen this before.",
            pastPerfect: "I had seen him earlier that day."
        }
    },
    {
        base: "come",
        past: "came",
        pastParticiple: "come",
        present: "comes",
        gerund: "coming",
        isRegular: false,
        examples: {
            present: "She comes home late.",
            past: "They came to the party.",
            future: "We will come back soon.",
            presentPerfect: "He has come a long way.",
            pastPerfect: "They had come prepared."
        }
    },
    {
        base: "give",
        past: "gave",
        pastParticiple: "given",
        present: "gives",
        gerund: "giving",
        isRegular: false,
        examples: {
            present: "He gives great advice.",
            past: "They gave it their all.",
            future: "We will give it a try.",
            presentPerfect: "She has given her answer.",
            pastPerfect: "I had given up hope."
        }
    },
    {
        base: "find",
        past: "found",
        pastParticiple: "found",
        present: "finds",
        gerund: "finding",
        isRegular: false,
        examples: {
            present: "She finds it interesting.",
            past: "They found the solution.",
            future: "We will find a way.",
            presentPerfect: "He has found his keys.",
            pastPerfect: "We had found out the truth."
        }
    },
    {
        base: "tell",
        past: "told",
        pastParticiple: "told",
        present: "tells",
        gerund: "telling",
        isRegular: false,
        examples: {
            present: "He tells great stories.",
            past: "They told me the news.",
            future: "We will tell everyone.",
            presentPerfect: "She has told the truth.",
            pastPerfect: "I had told them not to worry."
        }
    },
    {
        base: "become",
        past: "became",
        pastParticiple: "become",
        present: "becomes",
        gerund: "becoming",
        isRegular: false,
        examples: {
            present: "It becomes easier with practice.",
            past: "She became a doctor.",
            future: "They will become experts.",
            presentPerfect: "He has become famous.",
            pastPerfect: "It had become clear to everyone."
        }
    },
    {
        base: "show",
        past: "showed",
        pastParticiple: "shown",
        present: "shows",
        gerund: "showing",
        isRegular: false,
        examples: {
            present: "He shows great potential.",
            past: "They showed us around.",
            future: "We will show you how.",
            presentPerfect: "She has shown improvement.",
            pastPerfect: "They had shown interest before."
        }
    },
    {
        base: "leave",
        past: "left",
        pastParticiple: "left",
        present: "leaves",
        gerund: "leaving",
        isRegular: false,
        examples: {
            present: "She leaves for work early.",
            past: "They left without saying goodbye.",
            future: "We will leave tomorrow.",
            presentPerfect: "He has left the building.",
            pastPerfect: "I had left my phone at home."
        }
    },
    {
        base: "feel",
        past: "felt",
        pastParticiple: "felt",
        present: "feels",
        gerund: "feeling",
        isRegular: false,
        examples: {
            present: "It feels right.",
            past: "They felt happy.",
            future: "We will feel better soon.",
            presentPerfect: "She has felt this way before.",
            pastPerfect: "He had felt uncertain then."
        }
    },
    {
        base: "put",
        past: "put",
        pastParticiple: "put",
        present: "puts",
        gerund: "putting",
        isRegular: false,
        examples: {
            present: "He puts everything in order.",
            past: "They put it all away.",
            future: "We will put it here.",
            presentPerfect: "She has put a lot of effort in.",
            pastPerfect: "I had put it somewhere safe."
        }
    },
    {
        base: "bring",
        past: "brought",
        pastParticiple: "brought",
        present: "brings",
        gerund: "bringing",
        isRegular: false,
        examples: {
            present: "She brings joy to everyone.",
            past: "They brought food to the party.",
            future: "We will bring the documents.",
            presentPerfect: "He has brought his family along.",
            pastPerfect: "I had brought extra supplies."
        }
    },
    {
        base: "begin",
        past: "began",
        pastParticiple: "begun",
        present: "begins",
        gerund: "beginning",
        isRegular: false,
        examples: {
            present: "The movie begins at eight.",
            past: "They began their journey.",
            future: "We will begin soon.",
            presentPerfect: "She has begun to understand.",
            pastPerfect: "It had begun to rain."
        }
    },
    {
        base: "keep",
        past: "kept",
        pastParticiple: "kept",
        present: "keeps",
        gerund: "keeping",
        isRegular: false,
        examples: {
            present: "He keeps his promises.",
            past: "They kept the secret.",
            future: "We will keep in touch.",
            presentPerfect: "She has kept all the receipts.",
            pastPerfect: "We had kept quiet about it."
        }
    },
    {
        base: "hold",
        past: "held",
        pastParticiple: "held",
        present: "holds",
        gerund: "holding",
        isRegular: false,
        examples: {
            present: "She holds the record.",
            past: "They held a meeting.",
            future: "We will hold our position.",
            presentPerfect: "He has held that job for years.",
            pastPerfect: "I had held onto hope."
        }
    },
    {
        base: "write",
        past: "wrote",
        pastParticiple: "written",
        present: "writes",
        gerund: "writing",
        isRegular: false,
        examples: {
            present: "He writes beautiful poetry.",
            past: "They wrote a letter.",
            future: "We will write back soon.",
            presentPerfect: "She has written three books.",
            pastPerfect: "I had written the report already."
        }
    },
    {
        base: "stand",
        past: "stood",
        pastParticiple: "stood",
        present: "stands",
        gerund: "standing",
        isRegular: false,
        examples: {
            present: "He stands tall.",
            past: "They stood in line.",
            future: "We will stand together.",
            presentPerfect: "She has stood by me always.",
            pastPerfect: "We had stood there for hours."
        }
    },
    {
        base: "hear",
        past: "heard",
        pastParticiple: "heard",
        present: "hears",
        gerund: "hearing",
        isRegular: false,
        examples: {
            present: "She hears everything.",
            past: "They heard the news.",
            future: "We will hear from them soon.",
            presentPerfect: "He has heard this story before.",
            pastPerfect: "I had heard about that."
        }
    },
    {
        base: "let",
        past: "let",
        pastParticiple: "let",
        present: "lets",
        gerund: "letting",
        isRegular: false,
        examples: {
            present: "She lets me borrow her car.",
            past: "They let us go early.",
            future: "We will let you know.",
            presentPerfect: "He has let it happen.",
            pastPerfect: "They had let everyone leave."
        }
    },
    {
        base: "mean",
        past: "meant",
        pastParticiple: "meant",
        present: "means",
        gerund: "meaning",
        isRegular: false,
        examples: {
            present: "This means a lot to me.",
            past: "They meant well.",
            future: "We will mean business.",
            presentPerfect: "She has meant to call.",
            pastPerfect: "I had meant to tell you."
        }
    },
    {
        base: "set",
        past: "set",
        pastParticiple: "set",
        present: "sets",
        gerund: "setting",
        isRegular: false,
        examples: {
            present: "The sun sets in the west.",
            past: "They set a new record.",
            future: "We will set up the equipment.",
            presentPerfect: "He has set everything up.",
            pastPerfect: "We had set the table."
        }
    },
    {
        base: "meet",
        past: "met",
        pastParticiple: "met",
        present: "meets",
        gerund: "meeting",
        isRegular: false,
        examples: {
            present: "He meets clients every day.",
            past: "They met last week.",
            future: "We will meet tomorrow.",
            presentPerfect: "She has met all the requirements.",
            pastPerfect: "I had met him before."
        }
    },
    {
        base: "run",
        past: "ran",
        pastParticiple: "run",
        present: "runs",
        gerund: "running",
        isRegular: false,
        examples: {
            present: "She runs every morning.",
            past: "They ran a marathon.",
            future: "We will run the business.",
            presentPerfect: "He has run this route before.",
            pastPerfect: "They had run out of time."
        }
    },
    {
        base: "pay",
        past: "paid",
        pastParticiple: "paid",
        present: "pays",
        gerund: "paying",
        isRegular: false,
        examples: {
            present: "It pays to be honest.",
            past: "They paid the bill.",
            future: "We will pay you back.",
            presentPerfect: "She has paid for everything.",
            pastPerfect: "I had paid in advance."
        }
    },
    {
        base: "sit",
        past: "sat",
        pastParticiple: "sat",
        present: "sits",
        gerund: "sitting",
        isRegular: false,
        examples: {
            present: "He sits in the front row.",
            past: "They sat together.",
            future: "We will sit here.",
            presentPerfect: "She has sat through worse.",
            pastPerfect: "We had sat there before."
        }
    },
    {
        base: "speak",
        past: "spoke",
        pastParticiple: "spoken",
        present: "speaks",
        gerund: "speaking",
        isRegular: false,
        examples: {
            present: "She speaks three languages.",
            past: "They spoke about the future.",
            future: "We will speak later.",
            presentPerfect: "He has spoken to everyone.",
            pastPerfect: "I had spoken too soon."
        }
    },
    {
        base: "lie",
        past: "lay",
        pastParticiple: "lain",
        present: "lies",
        gerund: "lying",
        isRegular: false,
        examples: {
            present: "The answer lies within.",
            past: "He lay in bed all day.",
            future: "We will lie low for a while.",
            presentPerfect: "She has lain awake all night.",
            pastPerfect: "It had lain undisturbed for years."
        }
    },
    {
        base: "lead",
        past: "led",
        pastParticiple: "led",
        present: "leads",
        gerund: "leading",
        isRegular: false,
        examples: {
            present: "She leads by example.",
            past: "They led the team to victory.",
            future: "We will lead the way.",
            presentPerfect: "He has led many projects.",
            pastPerfect: "They had led us astray."
        }
    },
    {
        base: "break",
        past: "broke",
        pastParticiple: "broken",
        present: "breaks",
        gerund: "breaking",
        isRegular: false,
        examples: {
            present: "He breaks records regularly.",
            past: "They broke the news gently.",
            future: "We will break for lunch.",
            presentPerfect: "She has broken the code.",
            pastPerfect: "It had broken down again."
        }
    },
    {
        base: "read",
        past: "read",
        pastParticiple: "read",
        present: "reads",
        gerund: "reading",
        isRegular: false,
        examples: {
            present: "She reads every night.",
            past: "They read the instructions.",
            future: "We will read it together.",
            presentPerfect: "He has read all the books.",
            pastPerfect: "I had read about that."
        }
    },
    {
        base: "lose",
        past: "lost",
        pastParticiple: "lost",
        present: "loses",
        gerund: "losing",
        isRegular: false,
        examples: {
            present: "He loses his keys often.",
            past: "They lost the game.",
            future: "We will lose nothing by trying.",
            presentPerfect: "She has lost count.",
            pastPerfect: "We had lost our way."
        }
    }
];
// Base de datos de verbos
export const verbsDatabase: Verb[] = [
    ...regularVerbs,
    ...irregularVerbs

    // Aquí se podrían agregar más verbos según sea necesario
];

// Función para obtener verbos filtrados por dificultad y parámetros
export const getVerbsByDifficulty = (
    includeRegular: boolean,
    includeIrregular: boolean,
    count: number
): Verb[] => {
    // Filtramos según los parámetros
    let filteredVerbs = verbsDatabase.filter(verb => {
        if (!includeRegular && verb.isRegular) return false;
        if (!includeIrregular && !verb.isRegular) return false;
        return true;
    });



    // Mezclamos y limitamos al conteo solicitado
    return shuffle([...filteredVerbs]).slice(0, count);
};

// Obtener configuración del juego por dificultad
export const getGameConfigByDifficulty = (
    difficulty: DifficultyLevel,
    params: {
        includeRegular: boolean;
        includeIrregular: boolean;
        verbCount: number;
    }
): VerbFormsConfig => {
    const { includeRegular, includeIrregular, verbCount } = params;

    const verbs = getVerbsByDifficulty(
        includeRegular,
        includeIrregular,
        verbCount
    );

    // Determinamos el límite de tiempo según la dificultad
    let timeLimit: number;
    switch (difficulty) {
        case 'beginner':
            timeLimit = 240; // 4 minutos
            break;
        case 'intermediate':
            timeLimit = 180; // 3 minutos
            break;
        case 'advanced':
            timeLimit = 120; // 2 minutos
            break;
        default:
            timeLimit = 180;
    }

    return {
        verbs,
        timeLimit
    };
};

// Función para obtener la descripción de un tiempo verbal
export const getTenseDescription = (tense: VerbTense): string => {
    switch (tense) {
        case 'past':
            return "Pasado Simple (Past Simple)";
        case 'pastParticiple':
            return "Participio Pasado (Past Participle)";
        case 'present':
            return "Presente 3ra Persona (Present 3rd Person)";
        case 'gerund':
            return "Gerundio (-ing Form)";
        default:
            return "";
    }
};

// Función para obtener la explicación de un tiempo verbal
export const getTenseExplanation = (tense: VerbTense): string => {
    switch (tense) {
        case 'past':
            return "El pasado simple se usa para acciones completadas en el pasado. Para verbos regulares, se agrega -ed.";
        case 'pastParticiple':
            return "El participio pasado se usa para formar tiempos perfectos. Para verbos regulares, generalmente termina en -ed.";
        case 'present':
            return "La forma de tercera persona del singular en presente añade -s o -es al verbo base.";
        case 'gerund':
            return "El gerundio se forma añadiendo -ing al verbo base, con posibles cambios ortográficos.";
        default:
            return "";
    }
}; 