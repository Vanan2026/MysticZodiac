/**
 * Quick Start Example for Ziwei Dōufū Fortune Telling System
 * @module ziwei/example
 */

import { calculateBirthChart, formatBirthChart, BirthChart, ChartInput } from './index';

/**
 * Example 1: Basic usage with async/await
 */
async function example1() {
  console.log('=== Example 1: Basic Usage ===\n');
  
  const input: ChartInput = {
    year: 1990,
    month: 1,
    day: 15,
    hour: 10,
    gender: 'male',
  };
  
  const chart = await calculateBirthChart(input);
  console.log(formatBirthChart(chart));
}

/**
 * Example 2: Accessing individual palace data
 */
async function example2() {
  console.log('\n\n=== Example 2: Accessing Palace Data ===\n');
  
  const chart = await calculateBirthChart({
    year: 1985,
    month: 3,
    day: 8,
    hour: 14,
    gender: 'female',
  });
  
  // Iterate through all 12 palaces
  chart.palaces.forEach((palace, index) => {
    console.log(`${index}. ${palace.palace}`);
    console.log(`   Stems: ${palace.stem}`);
    console.log(`   Branch: ${palace.branch}`);
    if (palace.mainStars.length > 0) {
      console.log(`   Main Stars: ${palace.mainStars.join(', ')}`);
    }
    if (palace.assistantStars.length > 0) {
      console.log(`   Assistant Stars: ${palace.assistantStars.map(s => s.name).join(', ')}`);
    }
    console.log('');
  });
}

/**
 * Example 3: Checking Si Hua (Four Transformations)
 */
async function example3() {
  console.log('\n\n=== Example 3: Si Hua Analysis ===\n');
  
  const chart = await calculateBirthChart({
    year: 2000,
    month: 12,
    day: 25,
    hour: 23,
    gender: 'male',
  });
  
  console.log(`Year Stem: ${chart.siHua.stem}`);
  console.log(`Transformation of Wealth (化禄): ${chart.siHua.huaLu}`);
  console.log(`Transformation of Power (化权): ${chart.siHua.huaQuan}`);
  console.log(`Transformation of Knowledge (化科): ${chart.siHua.huaKe}`);
  console.log(`Transformation of Obstacle (化忌): ${chart.siHua.huaJi}`);
  
  // Find which palaces have Si Hua
  console.log('\nPalaces with Si Hua:');
  chart.palaces.forEach((palace, index) => {
    if (palace.siHua.lu || palace.siHua.quan || palace.siHua.ke || palace.siHua.ji) {
      const siHuaList: string[] = [];
      if (palace.siHua.lu) siHuaList.push(`化禄:${palace.siHua.lu}`);
      if (palace.siHua.quan) siHuaList.push(`化权:${palace.siHua.quan}`);
      if (palace.siHua.ke) siHuaList.push(`化科:${palace.siHua.ke}`);
      if (palace.siHua.ji) siHuaList.push(`化忌:${palace.siHua.ji}`);
      console.log(`  ${palace.palace}: ${siHuaList.join(', ')}`);
    }
  });
}

/**
 * Example 4: React Native component example (pseudocode)
 */
function example4ReactNative() {
  /*
  // In your React Native component:
  
  import { calculateBirthChart } from './ziwei';
  
  const BirthChartScreen = ({ route }) => {
    const [chart, setChart] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const { birthDate, birthTime, gender } = route.params;
      
      calculateBirthChart({
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day,
        hour: birthTime.hour,
        gender: gender,
      }).then(result => {
        setChart(result);
        setLoading(false);
      });
    }, [route.params]);
    
    if (loading) {
      return <ActivityIndicator />;
    }
    
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Birth Chart</Text>
        <Text>Year Pillar: {chart.yearPillar.stem}{chart.yearPillar.branch}</Text>
        <Text>Five Element Bureau: {chart.fiveElementBureau}</Text>
        
        {chart.palaces.map((palace, index) => (
          <View key={index} style={styles.palaceCard}>
            <Text style={styles.palaceName}>{palace.palace}</Text>
            {palace.mainStars.length > 0 && (
              <Text>Stars: {palace.mainStars.join(', ')}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };
  */
  console.log('\n\n=== Example 4: React Native Usage ===\n');
  console.log('See code comments for React Native integration example.');
}

// Run all examples
async function runExamples() {
  await example1();
  await example2();
  await example3();
  example4ReactNative();
}

runExamples().catch(console.error);
