import { createClient, RedisClientType } from 'redis';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

class AzureRedisDemo {
  private client: RedisClientType;

  constructor() {
    // Configurar conexão com Azure Redis Cache
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6380'),
        tls: true, // Azure Redis requer TLS
      },
      password: process.env.REDIS_PASSWORD,
    });

    // Handlers de eventos
    this.client.on('error', (err) => console.error('Redis Client Error:', err));
    this.client.on('connect', () => console.log('✓ Conectado ao Azure Redis Cache'));
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
    console.log('✓ Desconectado do Redis');
  }

  // 1. Operações básicas de String (GET/SET)
  async demonstrateStringOperations(): Promise<void> {
    console.log('\n=== 1. OPERAÇÕES COM STRINGS ===');
    
    // SET - definir valor
    await this.client.set('user:1:name', 'João Silva');
    console.log('✓ SET user:1:name = "João Silva"');
    
    // GET - obter valor
    const name = await this.client.get('user:1:name');
    console.log(`✓ GET user:1:name = "${name}"`);
    
    // SET com expiração (EX em segundos)
    await this.client.set('session:abc123', 'session_data', { EX: 300 });
    console.log('✓ SET session:abc123 com expiração de 300 segundos');
    
    // SETEX - alternativa para set com expiração
    await this.client.setEx('temp:key', 60, 'temporary_value');
    console.log('✓ SETEX temp:key = "temporary_value" (60 segundos)');
    
    // INCR - incrementar contador
    await this.client.set('page:views', '0');
    await this.client.incr('page:views');
    await this.client.incr('page:views');
    await this.client.incr('page:views');
    const views = await this.client.get('page:views');
    console.log(`✓ INCR page:views = ${views}`);
    
    // MSET/MGET - operações múltiplas
    await this.client.mSet({
      'user:1:email': 'joao@email.com',
      'user:1:age': '30',
      'user:1:city': 'São Paulo'
    });
    console.log('✓ MSET múltiplos campos de usuário');
    
    const userData = await this.client.mGet(['user:1:name', 'user:1:email', 'user:1:age']);
    console.log(`✓ MGET user data = [${userData.join(', ')}]`);
  }

  // 2. Operações com Listas
  async demonstrateListOperations(): Promise<void> {
    console.log('\n=== 2. OPERAÇÕES COM LISTAS ===');
    
    // LPUSH - adicionar à esquerda
    await this.client.lPush('queue:tasks', 'task1');
    await this.client.lPush('queue:tasks', 'task2');
    await this.client.lPush('queue:tasks', 'task3');
    console.log('✓ LPUSH 3 tarefas na fila');
    
    // RPUSH - adicionar à direita
    await this.client.rPush('queue:tasks', 'task4');
    console.log('✓ RPUSH task4');
    
    // LRANGE - obter range de elementos
    const tasks = await this.client.lRange('queue:tasks', 0, -1);
    console.log(`✓ LRANGE queue:tasks = [${tasks.join(', ')}]`);
    
    // LLEN - tamanho da lista
    const listLength = await this.client.lLen('queue:tasks');
    console.log(`✓ LLEN queue:tasks = ${listLength}`);
    
    // LPOP - remover da esquerda
    const poppedTask = await this.client.lPop('queue:tasks');
    console.log(`✓ LPOP queue:tasks = "${poppedTask}"`);
    
    // LINDEX - obter elemento por índice
    const taskAtIndex = await this.client.lIndex('queue:tasks', 0);
    console.log(`✓ LINDEX queue:tasks 0 = "${taskAtIndex}"`);
  }

  // 3. Operações com Sets
  async demonstrateSetOperations(): Promise<void> {
    console.log('\n=== 3. OPERAÇÕES COM SETS ===');
    
    // SADD - adicionar membros ao set
    await this.client.sAdd('tags:post1', ['nodejs', 'azure', 'redis', 'typescript']);
    console.log('✓ SADD tags para post1');
    
    await this.client.sAdd('tags:post2', ['nodejs', 'docker', 'azure']);
    console.log('✓ SADD tags para post2');
    
    // SMEMBERS - obter todos os membros
    const post1Tags = await this.client.sMembers('tags:post1');
    console.log(`✓ SMEMBERS tags:post1 = [${post1Tags.join(', ')}]`);
    
    // SISMEMBER - verificar se membro existe
    const hasRedis = await this.client.sIsMember('tags:post1', 'redis');
    console.log(`✓ SISMEMBER tags:post1 "redis" = ${hasRedis}`);
    
    // SCARD - contar membros
    const tagsCount = await this.client.sCard('tags:post1');
    console.log(`✓ SCARD tags:post1 = ${tagsCount}`);
    
    // SINTER - interseção de sets
    const commonTags = await this.client.sInter(['tags:post1', 'tags:post2']);
    console.log(`✓ SINTER tags comuns = [${commonTags.join(', ')}]`);
    
    // SUNION - união de sets
    const allTags = await this.client.sUnion(['tags:post1', 'tags:post2']);
    console.log(`✓ SUNION todas as tags = [${allTags.join(', ')}]`);
    
    // SDIFF - diferença de sets
    const uniqueTags = await this.client.sDiff(['tags:post1', 'tags:post2']);
    console.log(`✓ SDIFF tags únicas post1 = [${uniqueTags.join(', ')}]`);
  }

  // 4. Operações com Hashes
  async demonstrateHashOperations(): Promise<void> {
    console.log('\n=== 4. OPERAÇÕES COM HASHES ===');
    
    // HSET - definir campo no hash
    await this.client.hSet('product:100', {
      name: 'Notebook',
      price: '2500.00',
      stock: '15',
      category: 'Eletrônicos'
    });
    console.log('✓ HSET product:100 com múltiplos campos');
    
    // HGET - obter campo específico
    const productName = await this.client.hGet('product:100', 'name');
    console.log(`✓ HGET product:100 name = "${productName}"`);
    
    // HGETALL - obter todos os campos
    const product = await this.client.hGetAll('product:100');
    console.log('✓ HGETALL product:100 =', product);
    
    // HMGET - obter múltiplos campos
    const productInfo = await this.client.hmGet('product:100', ['name', 'price']);
    console.log(`✓ HMGET product:100 [name, price] = [${productInfo.join(', ')}]`);
    
    // HINCRBY - incrementar valor numérico
    await this.client.hIncrBy('product:100', 'stock', -3);
    const newStock = await this.client.hGet('product:100', 'stock');
    console.log(`✓ HINCRBY product:100 stock -3 = ${newStock}`);
    
    // HEXISTS - verificar se campo existe
    const hasPrice = await this.client.hExists('product:100', 'price');
    console.log(`✓ HEXISTS product:100 price = ${hasPrice}`);
    
    // HKEYS - obter todas as chaves
    const fields = await this.client.hKeys('product:100');
    console.log(`✓ HKEYS product:100 = [${fields.join(', ')}]`);
    
    // HVALS - obter todos os valores
    const values = await this.client.hVals('product:100');
    console.log(`✓ HVALS product:100 = [${values.join(', ')}]`);
  }

  // 5. Operações com Sorted Sets (ZSets)
  async demonstrateSortedSetOperations(): Promise<void> {
    console.log('\n=== 5. OPERAÇÕES COM SORTED SETS ===');
    
    // ZADD - adicionar membros com score
    await this.client.zAdd('leaderboard:game1', [
      { score: 1500, value: 'player1' },
      { score: 2300, value: 'player2' },
      { score: 1800, value: 'player3' },
      { score: 2100, value: 'player4' },
      { score: 1200, value: 'player5' }
    ]);
    console.log('✓ ZADD 5 jogadores no leaderboard');
    
    // ZRANGE - obter range em ordem crescente
    const bottomPlayers = await this.client.zRange('leaderboard:game1', 0, 2);
    console.log(`✓ ZRANGE bottom 3 players = [${bottomPlayers.join(', ')}]`);
    
    // // ZREVRANGE - obter range em ordem decrescente
    // const topPlayers = await this.client.zRange('leaderboard:game1', 0, 2, { REV: true });
    // console.log(`✓ ZREVRANGE top 3 players = [${topPlayers.join(', ')}]`);
    
    // ZRANK - obter posição (0-based)
    const player2Rank = await this.client.zRank('leaderboard:game1', 'player2');
    console.log(`✓ ZRANK player2 = ${player2Rank}`);
    
    // ZSCORE - obter score
    const player2Score = await this.client.zScore('leaderboard:game1', 'player2');
    console.log(`✓ ZSCORE player2 = ${player2Score}`);
    
    // ZINCRBY - incrementar score
    await this.client.zIncrBy('leaderboard:game1', 500, 'player1');
    console.log('✓ ZINCRBY player1 +500 pontos');
    
    // ZCARD - contar membros
    const playersCount = await this.client.zCard('leaderboard:game1');
    console.log(`✓ ZCARD leaderboard = ${playersCount} jogadores`);
    
    // ZCOUNT - contar membros em range de score
    const midRangePlayers = await this.client.zCount('leaderboard:game1', 1500, 2000);
    console.log(`✓ ZCOUNT players com score entre 1500-2000 = ${midRangePlayers}`);
  }

  // 6. Operações de Expiração e TTL
  async demonstrateExpirationOperations(): Promise<void> {
    console.log('\n=== 6. OPERAÇÕES DE EXPIRAÇÃO ===');
    
    // Criar chave sem expiração
    await this.client.set('persistent:key', 'value');
    console.log('✓ SET persistent:key');
    
    // EXPIRE - definir expiração em segundos
    await this.client.expire('persistent:key', 120);
    console.log('✓ EXPIRE persistent:key 120 segundos');
    
    // TTL - verificar tempo restante
    const ttl = await this.client.ttl('persistent:key');
    console.log(`✓ TTL persistent:key = ${ttl} segundos`);
    
    // PERSIST - remover expiração
    await this.client.persist('persistent:key');
    console.log('✓ PERSIST persistent:key (sem expiração)');
    
    const ttlAfterPersist = await this.client.ttl('persistent:key');
    console.log(`✓ TTL persistent:key = ${ttlAfterPersist} (-1 significa sem expiração)`);
    
    // EXPIREAT - definir expiração em timestamp Unix
    const futureTimestamp = Math.floor(Date.now() / 1000) + 300; // 5 minutos
    await this.client.set('scheduled:key', 'value');
    await this.client.expireAt('scheduled:key', futureTimestamp);
    console.log('✓ EXPIREAT scheduled:key para daqui 5 minutos');
  }

  // 7. Operações de Gerenciamento de Chaves
  async demonstrateKeyOperations(): Promise<void> {
    console.log('\n=== 7. OPERAÇÕES DE GERENCIAMENTO ===');
    
    // EXISTS - verificar se chave existe
    const exists = await this.client.exists('user:1:name');
    console.log(`✓ EXISTS user:1:name = ${exists}`);
    
    // KEYS - listar chaves por padrão (usar com cuidado em produção)
    const userKeys = await this.client.keys('user:1:*');
    console.log(`✓ KEYS user:1:* = [${userKeys.join(', ')}]`);
    
    // TYPE - obter tipo da chave
    const keyType = await this.client.type('user:1:name');
    console.log(`✓ TYPE user:1:name = ${keyType}`);
    
    // DEL - deletar chave
    await this.client.set('temp:delete', 'delete_me');
    await this.client.del('temp:delete');
    console.log('✓ DEL temp:delete');
    
    // RENAME - renomear chave
    await this.client.set('old:key', 'value');
    await this.client.rename('old:key', 'new:key');
    console.log('✓ RENAME old:key -> new:key');
    
    // DBSIZE - quantidade total de chaves
    const dbSize = await this.client.dbSize();
    console.log(`✓ DBSIZE = ${dbSize} chaves no banco`);
  }

  // 8. Operações de Transações e Pipeline
  async demonstrateTransactions(): Promise<void> {
    console.log('\n=== 8. TRANSAÇÕES ===');
    
    // MULTI/EXEC - transação atômica
    await this.client.set('balance:user1', '1000');
    await this.client.set('balance:user2', '500');
    
    const multi = this.client.multi();
    multi.decrBy('balance:user1', 100);
    multi.incrBy('balance:user2', 100);
    await multi.exec();
    
    const balance1 = await this.client.get('balance:user1');
    const balance2 = await this.client.get('balance:user2');
    console.log(`✓ Transferência executada: user1=${balance1}, user2=${balance2}`);
  }

  // Método principal para executar todas as demonstrações
  async runAllDemonstrations(): Promise<void> {
    try {
      await this.connect();
      
      console.log('\n🚀 INICIANDO DEMONSTRAÇÕES DO AZURE REDIS CACHE\n');
      
      await this.demonstrateStringOperations();
      await this.demonstrateListOperations();
      await this.demonstrateSetOperations();
      await this.demonstrateHashOperations();
      await this.demonstrateSortedSetOperations();
      await this.demonstrateExpirationOperations();
      await this.demonstrateKeyOperations();
      await this.demonstrateTransactions();
      
      console.log('\n✅ TODAS AS DEMONSTRAÇÕES CONCLUÍDAS COM SUCESSO!\n');
      
    } catch (error) {
      console.error('❌ Erro durante execução:', error);
    } finally {
      await this.disconnect();
    }
  }
}

// Executar demonstrações
const demo = new AzureRedisDemo();
demo.runAllDemonstrations();
