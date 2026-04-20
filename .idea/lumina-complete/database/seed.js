// Database Seeder - Creates demo data for testing
const { connectDB, disconnectDB } = require('./connection');
const { User, Post, Comment, Notification } = require('./models');

const demoUsers = [
  {
    name: 'Sarah Chen',
    email: 'sarah@lumina.dev',
    password: 'demo123',
    bio: 'Product designer & creative thinker. Building beautiful experiences. 🎨',
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@lumina.dev',
    password: 'demo123',
    bio: 'Full-stack developer. Coffee enthusiast. Open source contributor.',
  },
  {
    name: 'Emma Rodriguez',
    email: 'emma@lumina.dev',
    password: 'demo123',
    bio: 'Digital artist exploring the intersection of tech and creativity.',
  },
  {
    name: 'Alex Kim',
    email: 'alex@lumina.dev',
    password: 'demo123',
    bio: 'Startup founder. Lifelong learner. Sharing my journey.',
  }
];

const demoPosts = [
  {
    type: 'Journal',
    title: 'My Journey into Web Development',
    content: 'It\'s been an incredible year learning web development. From HTML/CSS basics to full-stack applications, every day brings new challenges and victories. The community support has been amazing!',
    tags: ['webdev', 'learning', 'career']
  },
  {
    type: 'Idea',
    title: 'Redesigning the Social Media Experience',
    content: 'What if social platforms focused more on meaningful connections rather than vanity metrics? Imagine a platform where quality of engagement matters more than quantity. Where learning and growth are prioritized.',
    tags: ['ideas', 'socialmedia', 'design']
  },
  {
    type: 'Journal',
    title: 'Why I Started Learning to Code',
    content: 'After years in a different industry, I decided to make the leap into tech. It wasn\'t easy, but the ability to build things that people use daily is incredibly fulfilling. If you\'re thinking about it - just start!',
    tags: ['career', 'motivation', 'coding']
  },
  {
    type: 'Idea',
    title: 'The Future of Remote Collaboration',
    content: 'Remote work is here to stay, but our tools haven\'t fully caught up. We need platforms that facilitate spontaneous collaboration while respecting async workflows. Think virtual coffee breaks, but productive.',
    tags: ['remote', 'future', 'collaboration']
  },
  {
    type: 'Journal',
    title: 'Lessons from Building My First App',
    content: 'Launched my first production app last week! Here are the key lessons: 1) Start small, 2) User feedback is gold, 3) Perfect is the enemy of done, 4) Documentation matters. Excited for what\'s next!',
    tags: ['development', 'startup', 'lessons']
  }
];

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});

    // Create users
    console.log('👥 Creating demo users...');
    const createdUsers = await User.create(demoUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create posts
    console.log('📝 Creating demo posts...');
    const createdPosts = [];
    for (let i = 0; i < demoPosts.length; i++) {
      const post = await Post.create({
        ...demoPosts[i],
        author: createdUsers[i % createdUsers.length]._id,
        likesCount: Math.floor(Math.random() * 50),
        commentsCount: Math.floor(Math.random() * 20),
        viewsCount: Math.floor(Math.random() * 200)
      });
      createdPosts.push(post);
    }
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Create some comments
    console.log('💬 Creating demo comments...');
    const comments = [
      {
        post: createdPosts[0]._id,
        author: createdUsers[1]._id,
        content: 'This is so inspiring! I\'m on a similar journey.'
      },
      {
        post: createdPosts[0]._id,
        author: createdUsers[2]._id,
        content: 'Great post! What resources would you recommend for beginners?'
      },
      {
        post: createdPosts[1]._id,
        author: createdUsers[3]._id,
        content: 'Love this perspective. Quality over quantity always!'
      },
      {
        post: createdPosts[2]._id,
        author: createdUsers[0]._id,
        content: 'Welcome to tech! The community is lucky to have you.'
      }
    ];
    await Comment.create(comments);
    console.log(`✅ Created ${comments.length} comments`);

    // Update comment counts
    for (const post of createdPosts) {
      const count = await Comment.countDocuments({ post: post._id });
      await Post.findByIdAndUpdate(post._id, { commentsCount: count });
    }

    // Create follow relationships
    console.log('🤝 Creating follow relationships...');
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      following: [createdUsers[1]._id, createdUsers[2]._id],
      followers: [createdUsers[1]._id, createdUsers[3]._id]
    });
    await User.findByIdAndUpdate(createdUsers[1]._id, {
      following: [createdUsers[0]._id, createdUsers[3]._id],
      followers: [createdUsers[0]._id, createdUsers[2]._id]
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Posts: ${createdPosts.length}`);
    console.log(`   Comments: ${comments.length}`);
    console.log('\n🔐 Demo Login Credentials:');
    console.log('   Email: sarah@lumina.dev');
    console.log('   Password: demo123\n');

    await disconnectDB();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seed();
}

module.exports = seed;
